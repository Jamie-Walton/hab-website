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
        # self.display_list = [name.replace("-", "_") for name in hab_list]
        self.display_list = [name for name in hab_list]
        
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


    def datetime2matlab(self, datetime):
        """Convert MATLAB datenum to a datetime"""

        delta = (datetime - dt.datetime(1, 1, 1))
        datenum = delta.total_seconds() / (24 * 60 * 60) + 367
        return datenum


    def convertFromHumboldt(self, mat):
        dates, classes, mL = mat['mdateTB'], mat['class2useTB'], mat['ml_analyzedTB']

        new_dates = np.array([[item] for item in dates[0]])
        new_classes = [item.strip() for item in classes]
        new_mL = [[item] for item in mL[0]]

        return [new_dates, new_classes, new_mL]
    

    def convertFromKudela(self, mat):
        classes = mat['class2useTB']
        new_classes = [item[0][0] for item in classes]
        new_classes = [nc if nc != "Pseudo-nitzschia" else "Pseudo_nitzschia" for nc in new_classes]

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

        if (self.name == 'humboldt'):
            [self.dates, self.classes, self.mL] = self.convertFromHumboldt(mat)
        elif (self.name == 'kudela'):
            self.classes = self.convertFromKudela(mat)

        if not start_date:
            if not week:
                raise Exception("Must provide either a start date or a week number")
            else:
                start_date = int(self.dates[len(self.dates)-1,0])-(7*week)
        
        while (self.matlab2datetime(start_date).year != self.matlab2datetime(int(self.dates[0,0])).year) and files:
            mat = scipy.io.loadmat(f'summary/{self.data_path}/{max(files)}')
            files = [f for f in files if f != max(files)]
            self.dates = mat['mdateTB']
            self.classes = mat['class2useTB']
            self.mL = mat['ml_analyzedTB']
            if (self.name == 'Humboldt'):
                [self.dates, self.classes, self.mL] = self.convertFromHumboldt(mat)
        
        indices = [i for i in range(len(self.classes)) if self.classes[i] in self.hab_list]
        self.classcount = (mat['classcountTB'][:, indices] / self.mL) * 1000
        sample_total = ((mat['classcountTB'] / self.mL) * 1000).sum(axis=1).round(0)
        
        return (start_date, self.classcount, sample_total)


    def wrap_data(self, start_date, end_date, classcount, hab_list, sample_total):
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
                [new_start, classcount,sample_total] = self.load_data(start_date=day)
            same_day_indices = np.where(np.floor(self.dates)==day)[0]
            timestamps = self.dates[same_day_indices, :]
            day_count = classcount[same_day_indices, :]
            day_total = sample_total[same_day_indices]
            seconds_ticks += [86400*daynum]

            if len(day_count) == 0:
                empties = True
            # Loop through each file that is in a given day
            for f in range(len(day_count)):
                file = day_count[f]
                final_counts = np.ndarray.tolist(file)
                #
                file_total = day_total[f]
                # For calculating total 
                # total_file = all_count[f]
                entry = {name:float(count) for name, count in zip(hab_list, final_counts)}
                time = self.matlab2datetime(timestamps[f][0]).strftime("%H:%M:%S").split(':')

                seconds = 86400*daynum + 3600*int(time[0]) + 60*int(time[1]) + int(time[2])
                entry['name'] = seconds
                entry['timestamp'] = self.matlab2datetime(timestamps[f][0]).strftime("%m/%d/%Y, %H:%M:%S")
                entry['datenum'] = timestamps[f][0]
                entry['Total'] = file_total
                weekcounts += [entry]

        data = {'counts': weekcounts,
                'empties': empties,
                'days': day_strings,
                'seconds_ticks': np.ndarray.tolist(np.unique(seconds_ticks)),
                }

        return data


    def load_warnings(self):
        '''Load warnings from the last 24 hours'''

       
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
        classcount = (mat['classcountTB'][:, indices] / self.mL) * 1000
        sample_total = ((mat['classcountTB'] / self.mL) * 1000).sum(axis=1).round(0)


        today = self.datetime2matlab(dt.datetime.now())
        data = self.wrap_data(int(self.dates[len(self.dates)-2,0]), int(self.dates[len(self.dates)-1,0]), classcount, self.hab_thresholds.keys(), sample_total)
        warnings = []
        for name,threshold in self.hab_thresholds.items():
            counts = [d[name] for d in data['counts'] if (d['datenum'] > today - 1) and (d[name] > threshold)]
            if counts:
                warnings.append(name)

        warningPackage = {
            'hasWarning': bool(warnings),
            'warnings': warnings,
            'date': self.matlab2datetime(int(self.dates[len(self.dates)-1,0])).strftime("%m/%d/%Y"),
            'recent': any([d for d in data['counts'] if (d['datenum'] > today - 1)])
        }

        return warningPackage