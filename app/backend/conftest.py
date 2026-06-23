import sys
from os.path import abspath, dirname

# Add the backend root directory to sys.path so 'app' module can be resolved
sys.path.insert(0, abspath(dirname(__file__)))
