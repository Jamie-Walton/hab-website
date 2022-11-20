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


@api_view(('GET',))
def load_data(request, week):
    hab_list = ['Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Dinophysis', \
               'Cochlodinium', 'Lingulodinium', 'Prorocentrum', \
               'Pseudo-nitzschia', 'Pennate']
    files = [f for f in os.listdir('IFCB104/summary/v1_27August2019') if 'summary_all' in f]
    mat = scipy.io.loadmat(f'IFCB104/summary/v1_27August2019/{max(files)}')
    files = [f for f in files if f != max(files)]
    dates = mat['mdateTB']
    startdate = int(dates[len(dates)-1,0])-(7*week)
    while matlab2datetime(startdate).year != matlab2datetime(int(dates[0,0])).year and files:
        mat = scipy.io.loadmat(f'IFCB104/summary/v1_27August2019/{max(files)}')
        files = [f for f in files if f != max(files)]
        dates = mat['mdateTB']
    
    classes = mat['class2useTB']
    indices = [i for i in range(len(classes)) if classes[i][0][0] in hab_list]
    mL = mat['ml_analyzedTB']
    classcount = mat['classcountTB'][:, indices] / mL
    weekcounts = []
    empties = False
    for day in range(startdate, startdate+7):
        same_day_indices = np.where(np.floor(dates)==day)[0]
        day_count = classcount[same_day_indices, :]
        day_mL = mL[same_day_indices, :]
        sums = sum(day_count/day_mL)
        if isinstance(sums, int):
            entry = {name:0 for name in hab_list}
            empties = True
        else:
            sums = np.ndarray.tolist(sums)
            entry = {name:float(count) for name,count in zip(hab_list,sums)}
        entry['name'] = matlab2datetime(day).strftime('%m/%d/%Y')
        weekcounts += [entry]
    data = {'counts': weekcounts,
            'empties': empties,
            }
    return JsonResponse(data)
