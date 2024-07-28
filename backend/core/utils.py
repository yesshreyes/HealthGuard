# core/custom_encoders.py

import numpy as np
from sklearn.preprocessing import LabelEncoder

class LabelEncoderWithUnknown(LabelEncoder):
    def fit(self, y):
        super().fit(y)
        self.classes_ = np.append(self.classes_, 'Unknown')
        return self

    def transform(self, y):
        y = np.array(y)
        unknown_mask = ~np.isin(y, self.classes_)
        y_transformed = super().transform(y)
        unknown_index = np.where(self.classes_ == 'Unknown')[0][0]
        y_transformed[unknown_mask] = unknown_index
        return y_transformed

    def inverse_transform(self, y):
        y_inverse_transformed = super().inverse_transform(y)
        unknown_index = np.where(self.classes_ == 'Unknown')[0][0]
        y_inverse_transformed = np.where(y == unknown_index, 'Unknown', y_inverse_transformed)
        return y_inverse_transformed
