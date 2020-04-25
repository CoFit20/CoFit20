

# How to run the webapp

```
git clone https://github.com/sfechner/CoFit20.git
pip install poetry
cd CoFit20
cd flask-app
poetry install
poetry run python main.py
```

Browse to 127.0.0.1:5000 to see an draft landing page.

127.0.0.1:5000/private should start a workout as defined in templates/example.json


127.0.0.1:5000/shared should start a group workout as defined in example_private.json on the time set at startTime