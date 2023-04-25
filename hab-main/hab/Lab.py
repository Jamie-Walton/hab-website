import scipy.io
import datetime as dt
import os
import numpy as np

class Lab:
    ''''Stores a lab and provides functionality for accessing its data'''

    def __init__(self, name, data_path, hab_list, hab_thresholds):
        self.name = name.replace(" ", "")
        self.data_path = data_path
        self.hab_list = hab_list
        self.display_list = [name.replace("-", "_") for name in hab_list]
        self.hab_thresholds = hab_thresholds
        self.dates = []
        self.classes = []
        self.classcount = []
        self.mL = []


    def matlab2datetime(self, matlab_datenum):
        """Convert MATLAB datenum to a datetime"""

        day = dt.datetime.fromordinal(int(matlab_datenum))
        dayfrac = dt.timedelta(days=matlab_datenum%1) - dt.timedelta(days = 366)
        return day + dayfrac

    def convertFromHumboldt(self, mat):
        dates, classes, mL = mat['mdateTB'], mat['class2useTB'], mat['ml_analyzedTB']

        new_dates = np.array([[item] for item in dates[0]])
        new_classes = [item.strip() for item in classes]
        new_mL = [[item] for item in mL[0]]

        return [new_dates, new_classes, new_mL]
    
    def convertFromKudela(self, mat):
        classes = mat['class2useTB']
        new_classes = [item[0][0] for item in classes]
        return new_classes

    def load_data(self, start_date=None, week=None):
        '''
        Load classcounts in date range
            START_DATE (optional) = The first date in range in ordinal form
            WEEK (optional) = The week number for the date range (where 1 is the most recent)
        '''

        files = [f for f in os.listdir(f'summary/{self.data_path}') if 'summary' in f]
        mat = scipy.io.loadmat(f'summary/{self.data_path}/{max(files)}')
        files = [f for f in files if f != max(files)]
        self.dates = mat['mdateTB']
        self.classes = mat['class2useTB']
        self.mL = mat['ml_analyzedTB']

        if not start_date:
            if not week:
                raise Exception("Must provide either a start date or a week number")
            else:
                start_date = int(self.dates[len(self.dates)-1,0])-(7*week)

        if (self.name == 'humboldt'):
            [self.dates, self.classes, self.mL] = self.convertFromHumboldt(mat)
        elif (self.name == 'kudela'):
            self.classes = self.convertFromKudela(mat)
        
        while (self.matlab2datetime(start_date).year != self.matlab2datetime(int(self.dates[0,0])).year) and files:
            mat = scipy.io.loadmat(f'summary/{self.data_path}/{max(files)}')
            files = [f for f in files if f != max(files)]
            self.dates = mat['mdateTB']
            self.classes = mat['class2useTB']
            self.mL = mat['ml_analyzedTB']
            if (self.name == 'Humboldt'):
                [self.dates, self.classes, self.mL] = self.convertFromHumboldt(mat)
        
        indices = [i for i in range(len(self.classes)) if self.classes[i] in self.hab_list]
        self.classcount = mat['classcountTB'][:, indices] / self.mL

        return (start_date, self.classcount)


    def wrap_data(self, start_date, end_date, classcount, hab_list):
        ''''Parse data for frontend-deliverable time series usage'''

        weekcounts = []
        empties = False
        days = range(start_date, end_date+1)
        day_strings = []
        seconds_ticks = []
        new_start = None

        for daynum in range(0,len(days)):

            day = days[daynum]
            day_strings += [self.matlab2datetime(day).strftime('%m/%d/%Y')]
            if (day_strings[0][6:10] != day_strings[len(day_strings)-1][6:10]) and not new_start:
                [new_start, classcount] = self.load_data(start_date=day)
            same_day_indices = np.where(np.floor(self.dates)==day)[0]
            timestamps = self.dates[same_day_indices, :]
            day_count = classcount[same_day_indices, :]

            for f in range(len(day_count)):
                file = day_count[f]
                final_counts = np.ndarray.tolist(file)
                entry = {name:float(count) for name, count in zip(hab_list, final_counts)}
                time = self.matlab2datetime(timestamps[f][0]).strftime("%H:%M:%S").split(':')

                seconds = 86400*daynum + 3600*int(time[0]) + 60*int(time[1]) + int(time[2])
                entry['name'] = seconds
                entry['timestamp'] = self.matlab2datetime(timestamps[f][0]).strftime("%m/%d/%Y, %H:%M:%S")
                entry['Total'] = sum(final_counts)
                weekcounts += [entry]
                seconds_ticks += [86400*daynum]
        data = {'counts': weekcounts,
                'empties': empties,
                'days': day_strings,
                'seconds_ticks': np.ndarray.tolist(np.unique(seconds_ticks)),
                }

        return data

    def load_warnings(self):
        '''Load most recent warnings'''

        files = [f for f in os.listdir(f'summary/{self.data_path}') if 'summary' in f]
        mat = scipy.io.loadmat(f'summary/{self.data_path}/{max(files)}')

        files = [f for f in os.listdir(f'summary/{self.data_path}') if 'summary' in f]
        mat = scipy.io.loadmat(f'summary/{self.data_path}/{max(files)}')
        files = [f for f in files if f != max(files)]
        self.dates = mat['mdateTB']
        self.classes = mat['class2useTB']
        self.mL = mat['ml_analyzedTB']

        if (self.name == 'humboldt'):
            [self.dates, self.classes, self.mL] = self.convertFromHumboldt(mat)
        elif (self.name == 'kudela'):
            self.classes = self.convertFromKudela(mat)

        indices = [i for i in range(len(self.classes)) if self.classes[i] in self.hab_thresholds.keys()]
        classcount = mat['classcountTB'][:, indices] / self.mL

        data = self.wrap_data(int(self.dates[len(self.dates)-1,0]), int(self.dates[len(self.dates)-1,0]), classcount, self.hab_thresholds.keys())

        warnings = []

        for name,threshold in self.hab_thresholds.items():
            counts = [d[name] for d in data['counts'] if d[name] > threshold]
            if counts:
                warnings.append(name)

        warningPackage = {
            'warnings': warnings,
            'date': self.matlab2datetime(int(self.dates[len(self.dates)-1,0])).strftime("%m/%d/%y"),
        }

        return warningPackage