import scipy
from views import load_warnings, load_by_week, load_data

expected = scipy.io.loadmat('hab/testClasscount.mat')['classcount']
[start_date, dates, classcount, mL, hab_list] = load_data(738887)
print((classcount == expected).all())
print(classcount)
print('==========================================================================')
print(expected)