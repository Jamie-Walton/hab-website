from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
import scipy.io
import datetime as dt


def matlab2datetime(matlab_datenum):
    day = dt.datetime.fromordinal(int(matlab_datenum))
    dayfrac = dt.timedelta(days=matlab_datenum%1) - dt.timedelta(days = 366)
    return day + dayfrac

@api_view(('GET',))
def load_data(request, week):
    hab_list = ['Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Dinophysis', \
               'Cochlodinium', 'Lingulodinium', 'Prorocentrum', \
               'Pseudo-nitzschia', 'Pennate']
    mat = scipy.io.loadmat('IFCB104/summary/v1_27August2019/summary_allTB_2022.mat')
    classes = mat['class2useTB']
    dates = mat['mdateTB']
    mL = mat['ml_analyzedTB']
    indices = [i for i in range(len(classes)) if classes[i][0][0] in hab_list]
    classcount = mat['classcountTB'][:, indices] / mL
    startdate = int(dates[len(dates)-1,0])-(7*week)
    weekcounts = []
    empties = False
    for day in range(startdate, startdate+7):
        sums = sum([classcount[i,:]/mL[i] for i in range(len(classcount)) if int(dates[i])==day and mL[i] != 0])
        if isinstance(sums, int):
            entry = {name:0 for name in hab_list}
            empties = True
        else:
            entry = {name:float(count) for name,count in zip(hab_list,sums)}
        entry['name'] = matlab2datetime(day).strftime('%m/%d/%Y')
        weekcounts += [entry]
    data = {'counts': weekcounts,
            'empties': empties,
            }
    return JsonResponse(data)
