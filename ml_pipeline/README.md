# ML pipeline

- `data/` — raw datasets (git-ignored)
- `notebooks/` — EDA and experiments
- `train.py` — training script (to add)
- `artifacts/` — saved `.pkl` / `.joblib` models (git-ignored in production; use GCS)

Train locally, then load the artifact from the FastAPI backend or Google Cloud Storage.
