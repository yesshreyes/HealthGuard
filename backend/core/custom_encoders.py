# core/custom_encoders.py

from sklearn.preprocessing import LabelEncoder
import numpy as np

class LabelEncoderWithUnknown(LabelEncoder):
    def __init__(self):
        super().__init__()

    def fit(self, y):
        super().fit(y)
        # Ensure 'Unknown' is added only if it doesn't already exist
        if 'Unknown' not in self.classes_:
            self.classes_ = np.append(self.classes_, 'Unknown')
        return self

    def transform(self, y):
        unknown_label = 'Unknown'
        y = np.array(y)
        y_transformed = np.where(np.isin(y, self.classes_), super().transform(y), -1)
        if unknown_label in self.classes_:
            unknown_index = np.where(self.classes_ == unknown_label)[0][0]
            y_transformed = np.where(y_transformed == -1, unknown_index, y_transformed)
        return y_transformed

    def inverse_transform(self, y):
        unknown_label = 'Unknown'
        y_inverse_transformed = super().inverse_transform(y)
        y_inverse_transformed = np.where(y == -1, unknown_label, y_inverse_transformed)
        return y_inverse_transformed
