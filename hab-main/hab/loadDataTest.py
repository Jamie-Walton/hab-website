import scipy.io
import numpy as np
import os

kudelafiles = [f for f in os.listdir(f'/Users/jamiewalton/Desktop/HAB_v1/hab-main/summary/kudela') if 'summary_all' in f]
kudelamat = scipy.io.loadmat(f'/Users/jamiewalton/Desktop/HAB_v1/hab-main/summary/kudela/{max(kudelafiles)}')
kudelafiles = [f for f in kudelafiles if f != max(kudelafiles)]
kudeladates = kudelamat['mdateTB']
kudelaclasses = kudelamat['class2useTB']
kudelamL = kudelamat['ml_analyzedTB']
kudelaclasscount = kudelamat['classcountTB']

humboldtfiles = [f for f in os.listdir(f'/Users/jamiewalton/Desktop/HAB_v1/hab-main/summary/humboldt') if 'summary_all' in f]
humboldtmat = scipy.io.loadmat(f'/Users/jamiewalton/Desktop/HAB_v1/hab-main/summary/humboldt/{max(humboldtfiles)}')
humboldtfiles = [f for f in humboldtfiles if f != max(humboldtfiles)]
humboldtdates = humboldtmat['mdateTB']
humboldtclasses = humboldtmat['class2useTB']
humboldtmL = humboldtmat['ml_analyzedTB']
humboldtclasscount = humboldtmat['classcountTB']

newdates = [[item] for item in humboldtdates[0]] # convert to kudela format
newkudelaclasses = [item[0][0] for item in kudelaclasses] # convert to basic list
newhumboldtclasses = [item.strip() for item in humboldtclasses]
newmL = [[item] for item in humboldtmL[0]] # convert to kudela format
# classcount is fine

print('===============')
print(kudelaclasscount)
print('===============')
print(humboldtclasscount)
print('===============')
