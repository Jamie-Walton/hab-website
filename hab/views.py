from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
import scipy.io
import datetime as dt
import os
import numpy as np


def matlab2datetime(matlab_datenum):
    day = dt.datetime.fromordinal(int(matlab_datenum))
    dayfrac = dt.timedelta(days=matlab_datenum%1) - dt.timedelta(days = 366)
    return day + dayfrac


def load_data(start_date=None, week=None):

    hab_list = ['Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Dinophysis', \
               'Cochlodinium', 'Lingulodinium', 'Prorocentrum', \
               'Pseudo-nitzschia', 'Pennate']
    files = [f for f in os.listdir('IFCB104/summary/v1_27August2019') if 'summary_all' in f]
    mat = scipy.io.loadmat(f'IFCB104/summary/v1_27August2019/{max(files)}')
    files = [f for f in files if f != max(files)]
    dates = mat['mdateTB']
    if not start_date:
        start_date = int(dates[len(dates)-1,0])-(7*week)
    while matlab2datetime(start_date).year != matlab2datetime(int(dates[0,0])).year and files:
        mat = scipy.io.loadmat(f'IFCB104/summary/v1_27August2019/{max(files)}')
        files = [f for f in files if f != max(files)]
        dates = mat['mdateTB']
    
    classes = mat['class2useTB']
    indices = [i for i in range(len(classes)) if classes[i][0][0] in hab_list]
    hab_list = ['Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Dinophysis', \
               'Cochlodinium', 'Lingulodinium', 'Prorocentrum', \
               'Pseudo_nitzschia', 'Pennate']
    mL = mat['ml_analyzedTB']
    classcount = mat['classcountTB'][:, indices] / mL

    return (start_date, dates, classcount, mL, hab_list)


def wrap_data(start_date, end_date, dates, classcount, mL, hab_list):

    weekcounts = []
    empties = False
    days = range(start_date, end_date+1)
    day_strings = []
    seconds_ticks = []
    new_start = None
    for daynum in range(0,len(days)):
        day = days[daynum]
        day_strings += [matlab2datetime(day).strftime('%m/%d/%Y')]
        if (day_strings[0][6:10] != day_strings[len(day_strings)-1][6:10]) and not new_start:
            [new_start, dates, classcount, mL, hab_list] = load_data(start_date=day)
        same_day_indices = np.where(np.floor(dates)==day)[0]
        timestamps = dates[same_day_indices, :]
        day_count = classcount[same_day_indices, :]
        day_mL = mL[same_day_indices, :]
        file_counts = day_count/day_mL
        for f in range(len(file_counts)):
            file = file_counts[f]
            final_counts = np.ndarray.tolist(file)
            entry = {name:float(count) for name,count in zip(hab_list,final_counts)}
            time = matlab2datetime(timestamps[f][0]).strftime("%H:%M:%S").split(':')
            seconds = 86400*daynum + 3600*int(time[0]) + 60*int(time[1]) + int(time[2])
            entry['name'] = seconds
            entry['timestamp'] = matlab2datetime(timestamps[f][0]).strftime("%m/%d/%Y, %H:%M:%S")
            entry['Total'] = sum(final_counts)
            weekcounts += [entry]
            seconds_ticks += [86400*daynum]
    data = {'counts': weekcounts,
            'empties': empties,
            'days': day_strings,
            'seconds_ticks': np.ndarray.tolist(np.unique(seconds_ticks)),
            }

    return data
    


@api_view(('GET',))
def load_by_week(request, week):

    [start_date, dates, classcount, mL, hab_list] = load_data(week=week)
    data = wrap_data(start_date, start_date+6, dates, classcount, mL, hab_list)

    return JsonResponse(data)


@api_view(('GET',))
def load_by_range(request, start_date, end_date):

    assert len(start_date) == 8, 'Start date is not valid.'
    assert len(end_date) == 8, 'End date is not valid.'

    ord_start = dt.datetime.toordinal(dt.datetime.strptime(start_date, '%m%d%Y'))+366
    ord_end = dt.datetime.toordinal(dt.datetime.strptime(end_date, '%m%d%Y'))+366
    [ord_start, dates, classcount, mL, hab_list] = load_data(start_date=ord_start)
    data = wrap_data(ord_start, ord_end, dates, classcount, mL, hab_list)
    
    return JsonResponse(data)




