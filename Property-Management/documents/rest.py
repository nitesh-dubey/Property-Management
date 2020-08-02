import pandas as pd
import numpy as np
from random import randint

# agent
d = {
	'1' : ['1', 'agent1', "9838252273"],
	'2' : ['2', 'agent2', "9642016755"],
	'3' : ['3', 'agent3', "9771514179"],
	'4' : ['4', 'agent4', "9628710184"],
	'5' : ['5', 'agent5', "9723387804"],
	'6' : ['6', 'agent6', "9891564932"],
	'7' : ['7', 'agent7', "9681632661"],
	'8' : ['8', 'agent8', "9100872329"],
	'9' : ['9', 'agent9', "9015207056"],
	'10' : ['10', 'agent10', "9018207056"],
}
aCols = ['aid', 'name', 'contact']
df = pd.DataFrame.from_dict(d, orient='index', columns=aCols)
df.to_csv('Agents.csv', index=False)


# sold
pid = list(pd.read_csv('Property2.csv').pid)
sCols = ['pid', 'aid', 'pStatus', 'date']

d = dict()

sold = np.random.choice(pid[:1000], 300, replace=False).tolist()
for i in sold:
	date = '{}'.format(randint(2010, 2019))
	d.update({i : [i, randint(1,10), 'sold', date]})

rented = np.random.choice(pid[1000:], 200, replace=False).tolist()
for i in rented:
	date = '{}'.format(randint(2010, 2019))
	d.update({i : [i, randint(1,10), 'rented', date]})

available = list(set(pid).difference(set(sold + rented)))

for i in available:
	d.update({i : [i, '\N', 'available', '\N']})

df = pd.DataFrame.from_dict(d, orient='index', columns=sCols)
df.to_csv('Status.csv', index=False)

