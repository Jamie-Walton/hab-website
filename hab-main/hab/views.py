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

    [start_date, dates, classcount] = lab.load_data(week=week)
    data = lab.wrap_data(start_date, start_date+7, dates, classcount, lab.display_list)

    return JsonResponse(data)


@api_view(('GET',))
def load_by_range(request, lab_name, start_date, end_date):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    assert len(start_date) == 8, 'Start date is not valid.'
    assert len(end_date) == 8, 'End date is not valid.'

    ord_start = dt.datetime.toordinal(dt.datetime.strptime(start_date, '%m%d%Y'))+366
    ord_end = dt.datetime.toordinal(dt.datetime.strptime(end_date, '%m%d%Y'))+366
    [ord_start, dates, classcount] = lab.load_data(start_date=ord_start)
    data = lab.wrap_data(ord_start, ord_end, dates, classcount, lab.display_list)
    
    return JsonResponse(data)


@api_view(('GET',))
def load_warnings(request, lab_name):

    lab_directory = make_labs()
    lab = lab_directory[lab_name]

    return JsonResponse(lab.load_warnings())


