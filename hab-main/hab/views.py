from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
import scipy.io
import datetime as dt
import os
import numpy as np
from .lab_directory import make_labs
    

@api_view(('GET',))
def load_by_week(request, lab_name, week):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    [start_date, classcount, sample_total] = lab.load_data(week=week)
    data = lab.wrap_data(start_date, start_date+7, classcount, lab.display_list,sample_total)

    return JsonResponse(data)


@api_view(('GET',))
def load_by_range(request, lab_name, start_date, end_date):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    assert len(start_date) == 8, 'Start date is not valid.'
    assert len(end_date) == 8, 'End date is not valid.'

    ord_start = dt.datetime.toordinal(dt.datetime.strptime(start_date, '%m%d%Y'))+366
    ord_end = dt.datetime.toordinal(dt.datetime.strptime(end_date, '%m%d%Y'))+366
    [ord_start, classcount, sample_total] = lab.load_data(start_date=ord_start)
    data = lab.wrap_data(ord_start, ord_end, classcount, lab.display_list,sample_total)
    
    return JsonResponse(data)


@api_view(('GET',))
def load_warnings(request, lab_name):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    return JsonResponse(lab.load_warnings())


@api_view(('GET',))
def load_info(request, lab_name):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    info = {
        "hab_list": lab.display_list,
        "hab_thresholds": lab.hab_thresholds
    }

    return JsonResponse(info)


