CREATE DATABASE Project;

USE Project;

CREATE TABLE Property (
	pid INTEGER,
	city VARCHAR(40),
	address VARCHAR(40),
	price INTEGER,
	rent INTEGER,
	area INTEGER,
	bedrooms INTEGER,
	PRIMARY KEY (pid)
);

CREATE TABLE Agents (
	aid INTEGER,
	name VARCHAR(40),
	contact NUMERIC(10,0),
	PRIMARY KEY (aid)
);

CREATE TABLE Status (
	pid INTEGER,
	aid INTEGER,
	pStatus VARCHAR(40),
	date INTEGER,
	PRIMARY KEY (pid),
	FOREIGN KEY (pid) REFERENCES Property(pid),
	FOREIGN KEY (aid) REFERENCES Agents(aid)
);

load data local infile "p.txt" into table Property fields terminated by ',';
load data local infile "a.txt" into table Agents fields terminated by ',';
load data local infile "s.txt" into table Status fields terminated by ',';

4)

-- (a) Find addresses of homes in your city (for example Guwahati) costing between Rs.20,00,000 and Rs. 40,00,000.

select distinct city, address
from Property p
where p.price >= 2000000 and p.price <= 4000000;

-- (b) Find addresses of homes for rent in G.S.Road (you can use the name of another locality if your city is different) 
--     with at least 2 bedrooms and costing less than Rs.10,000 per month.

select distinct city, address
from Property p, Status s
where p.bedrooms >= 2 and p.rent < 10000 and s.pStatus = "available" and p.pid = s.pid;

-- (c) Find the name of the agent who has sold the most property in the year 2019 by total amount in rupees.

select s.aid, SUM(p.price)
from Status s, Property p
where s.pid = p.pid and s.date like '%2019'
group by s.aid
having SUM(p.price) >= ALL(
	select SUM(p.price)
	from Status s, Property p
	where s.pid = p.pid and s.date like '%2019'
	group by s.aid
);

-- (d) For each agent, compute the average selling price of properties sold in 2018, and the average time the
--     property was on the market. Note that this suggests use of date attributes in your design.

select a.name as agent_name, AVG(p.price) as avg_price, AVG(s.date)-2010 as avg_time_in_years
from Property p, Agents a, Status s
where s.pid = p.pid and s.aid = a.aid
group by a.name, a.aid;

-- (e) List the details of the most expensive houses and the houses with the highest rent, in the database.

select * from Property p
where p.price > (
	select MAX(p1.price) from Property p1
	where p.pid != p1.pid
);