# Before, generate more fake data into control...
import requests
import os
import csv
import time
import asyncio
from json import dumps

os.environ['NO_PROXY'] = '127.0.0.1'

# A/B Testing of LRU Cache vs No Caching
first_params = '''query=Recreation&box=-123.15231732025153%2C49.236155417153384%2C-123.04744247416485%2C49.296631626845766&time=6%2C64%2C2016%2C5%2C2021%2C9%2C64&sortOrderParams='''
second_params = '''query=Temperature&box=-123.15231732025153%2C49.236155417153384%2C-123.04744247416485%2C49.296631626845766&time=6%2C64%2C2016%2C5%2C2021%2C9%2C64&sortOrderParams='''

def current_time_ms():
    return round(time.time() * 1000)

# (123.15231732025153,49.236155417153384),(-123.04744247416485,49.296631626845766)

cache_request_times = []

def run_experiment():
  for i in range(31):
    start = current_time_ms()
    r = requests.get(f'http://localhost:8000/alldata/?{first_params}')
    end = current_time_ms()
    cache_request_times.append([end-start])

  print(cache_request_times)

  no_cache_request_times = []

  for i in range(31):
    start = current_time_ms()
    params = first_params if i%2==1 else second_params
    r = requests.get(f'http://localhost:8000/alldata/?{params}')
    end = current_time_ms()
    no_cache_request_times.append([end-start])

  print(no_cache_request_times)

  with open('output.csv', 'w') as f:
      writer = csv.writer(f)
      writer.writerow(['cache request times'])
      writer.writerows(cache_request_times)
      writer.writerow(['no cache request times'])
      writer.writerows(no_cache_request_times)

run_experiment()
