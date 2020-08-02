import requests
import os
import json
import pandas as pd
from bs4 import BeautifulSoup as bs

def location_finder(dataset_rows):
	url = 'https://www.makaan.com/all-cities-overview?page={}'
	entry_per_location = 100
	cities, n = dataset_rows // entry_per_location, 1
	names = set()
	print('parsing city names - ')
	while len(names) < cities:
		page = requests.get(url.format(n))
		if page.status_code == 200:
			soup = bs(page.content, 'html.parser')
			w = soup.find_all('span', {'class': 'city-name'})
			for c in w:
				if len(names) < cities:
					names.add(c.get_text())
			print('\tparsed page {}...'.format(n))
			n += 1
	print('total cities : {}'.format(len(names)))
	return list(names)

def create_dataset(locations, columns):
	url = 'https://www.makaan.com/guwahati-residential-property/buy-apartments-in-{}-city?page={}'
	store = dict()
	pid = 1      # property-id
	entry_per_location = 100
	max_pages = 150

	for index, location in enumerate(locations):
		print('\nParsing city : {} - ({} of {})'.format(location, index+1, len(locations)))
		entry = 0
		n = 1
		
		while entry < entry_per_location:
			page = requests.get(url.format(location, n))
			if page.status_code == 200:
				soup = bs(page.content, 'html.parser')
				w = soup.find_all('script', {'type': 'text/x-config'})
				for i in w:
					data = json.loads(i.get_text())
					if 'selector' in data:
						city     = data["cityName"]
						address  = data["localityName"]
						price    = int(data["price"])
						rent     = int(price * 0.03)//12 if int(price * 0.03)//12 < 20000 else 20000
						area     = int(''.join([j for j in data["size"].split()[0] if j.isdigit()]))
						bedrooms = data["bedrooms"]
						addList  = [pid, city, address, price, rent, area, bedrooms]
						store.update({pid : addList})
						pid += 1
						entry += 1
						if entry >= entry_per_location:
							break
				print('\tParsed page {}...'.format(n))
				if n > max_pages :
					print('Exceeded max pages, no. of properties obtained = {}'.format(entry))
					break
			else:
				print('Error in page {}, status code : {}'.format(n, page.status_code))
				break
			n += 1
	return store

def scrape(nrows, columns):
	got = any([True if x == 'Property.csv' else False for x in os.listdir()])
	if got:
		df = pd.read_csv('Property.csv')
	else:
		loc = location_finder(nrows)
		data = create_dataset(loc, columns)
		df = pd.DataFrame.from_dict(data, orient='index', columns=columns)
	df.drop_duplicates(subset=columns[1:], keep='first', inplace=True)
	df.dropna(inplace=True)
	df['bedrooms'] = df['bedrooms'].astype(int)
	df.to_csv('Property2.csv', encoding='utf-8', index=False)

columns = ["pid", "city", "address", "price", "rent", "area", "bedrooms"]     # area in sq. ft.
nrows = 10000
scrape(nrows, columns)

