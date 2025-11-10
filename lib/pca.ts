import { Matrix } from 'ml-matrix';

export interface PCAResult {
  transformed: number[][]; // 2D points after PCA
  components: number[][]; // Principal components (2x8 matrix)
  explainedVariance: number[]; // Variance explained by each component
}

// Standardize data (mean = 0, std = 1)
function standardize(data: number[][]): number[][] {
  const n = data.length;
  const m = data[0].length;
  
  // Calculate means
  const means = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      means[j] += data[i][j];
    }
  }
  for (let j = 0; j < m; j++) {
    means[j] /= n;
  }
  
  // Calculate standard deviations
  const stds = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      stds[j] += Math.pow(data[i][j] - means[j], 2);
    }
  }
  for (let j = 0; j < m; j++) {
    stds[j] = Math.sqrt(stds[j] / (n - 1)) || 1;
  }
  
  // Standardize
  const standardized = data.map(row => 
    row.map((val, idx) => (val - means[idx]) / stds[idx])
  );
  
  return standardized;
}

// Perform PCA using SVD (Singular Value Decomposition)
export function performPCA(data: number[][], numComponents: number = 2): PCAResult {
  if (data.length === 0 || data[0].length === 0) {
    throw new Error('Data cannot be empty');
  }
  
  // Standardize the data
  const standardized = standardize(data);
  
  // Create matrix from standardized data
  const X = new Matrix(standardized);
  
  try {
    // Perform SVD: X = U * S * V^T
    // ml-matrix SVD returns: { leftSingularVectors: U, rightSingularVectors: V, diagonal: s }
    const svd = X.svd();
    
    // Access SVD results - ml-matrix uses these property names
    const Vt = (svd as any).rightSingularVectors;
    const singularValues = (svd as any).diagonal;
    
    if (!Vt) {
      throw new Error('SVD failed - no right singular vectors');
    }
    
    const components: number[][] = [];
    
    // Get first numComponents rows of V^T (principal components)
    const numComps = Math.min(numComponents, Vt.rows);
    for (let i = 0; i < numComps; i++) {
      const component: number[] = [];
      for (let j = 0; j < Vt.columns; j++) {
        component.push(Vt.get(i, j));
      }
      components.push(component);
    }
    
    // Transform data: X * V (first numComponents columns of V)
    // Vt is V^T, so transpose to get V, then take first numComponents columns
    const Vt_reduced = Vt.subMatrix(0, numComps - 1, 0, Vt.columns - 1);
    const V_reduced = Vt_reduced.transpose();
    const transformedMatrix = X.mmul(V_reduced);
    
    // Convert to array
    const transformed: number[][] = [];
    for (let i = 0; i < transformedMatrix.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < Math.min(numComponents, transformedMatrix.columns); j++) {
        row.push(transformedMatrix.get(i, j));
      }
      transformed.push(row);
    }
    
    // Calculate explained variance from singular values
    // For standardized data, total variance = number of dimensions (each has variance 1)
    const numDimensions = standardized[0].length;
    const n = standardized.length;
    
    // Extract all singular values to compute total variance correctly
    const allSingularValues: number[] = [];
    if (Array.isArray(singularValues)) {
      for (let i = 0; i < singularValues.length; i++) {
        allSingularValues.push(singularValues[i]);
      }
    } else if (singularValues && typeof singularValues === 'object') {
      const sMatrix = singularValues as Matrix;
      for (let i = 0; i < Math.min(sMatrix.rows, sMatrix.columns); i++) {
        allSingularValues.push(sMatrix.get(i, i));
      }
    }
    
    // Convert singular values to eigenvalues: lambda = s^2 / (n-1)
    const allEigenvalues = allSingularValues.map(s => (s * s) / (n - 1));
    const totalVariance = allEigenvalues.reduce((sum, val) => sum + val, 0);
    
    // Calculate explained variance for first numComponents
    const explainedVariance = allEigenvalues.slice(0, numComponents).map(val => val / totalVariance);
    
    // Ensure we have at least numComponents values
    while (explainedVariance.length < numComponents) {
      explainedVariance.push(explainedVariance.length > 0 ? 0 : 1 / numComponents);
    }
    
    return {
      transformed,
      components,
      explainedVariance: explainedVariance.slice(0, numComponents),
    };
  } catch (error) {
    // Fallback: Use covariance matrix approach if SVD fails
    console.warn('SVD failed, using covariance matrix approach:', error);
    return performPCACovariance(standardized, numComponents);
  }
}

// Fallback PCA implementation using covariance matrix
function performPCACovariance(standardized: number[][], numComponents: number): PCAResult {
  const n = standardized.length;
  const m = standardized[0].length;
  
  // Calculate covariance matrix
  const cov: number[][] = [];
  for (let i = 0; i < m; i++) {
    cov[i] = [];
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += standardized[k][i] * standardized[k][j];
      }
      cov[i][j] = sum / (n - 1);
    }
  }
  
  // Simple power iteration for eigenvectors (simplified)
  const components: number[][] = [];
  const eigenvalues: number[] = [];
  
  for (let comp = 0; comp < numComponents; comp++) {
    let eigenvector = new Array(m).fill(0).map(() => Math.random() - 0.5);
    let norm = Math.sqrt(eigenvector.reduce((sum, val) => sum + val * val, 0));
    eigenvector = eigenvector.map(val => val / norm);
    
    for (let iter = 0; iter < 50; iter++) {
      const newVec = new Array(m).fill(0);
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
          newVec[i] += cov[i][j] * eigenvector[j];
        }
      }
      
      // Deflate
      for (let prev = 0; prev < comp; prev++) {
        const prevVec = components[prev];
        const dot = newVec.reduce((sum, val, idx) => sum + val * prevVec[idx], 0);
        for (let i = 0; i < m; i++) {
          newVec[i] -= dot * prevVec[i];
        }
      }
      
      norm = Math.sqrt(newVec.reduce((sum, val) => sum + val * val, 0));
      if (norm < 1e-10) break;
      eigenvector = newVec.map(val => val / norm);
    }
    
    // Calculate eigenvalue
    let eigenvalue = 0;
    for (let i = 0; i < m; i++) {
      let dot = 0;
      for (let j = 0; j < m; j++) {
        dot += cov[i][j] * eigenvector[j];
      }
      eigenvalue += dot * eigenvector[i];
    }
    
    components.push(eigenvector);
    eigenvalues.push(Math.abs(eigenvalue));
  }
  
  // Transform data
  const transformed = standardized.map(row => {
    const point: number[] = [];
    for (let comp = 0; comp < numComponents; comp++) {
      let sum = 0;
      for (let i = 0; i < row.length; i++) {
        sum += row[i] * components[comp][i];
      }
      point.push(sum);
    }
    return point;
  });
  
  // Calculate explained variance
  // Total variance = trace of covariance matrix = sum of all eigenvalues
  // For standardized data, this should equal number of dimensions
  // But we compute it from the covariance matrix to be accurate
  let totalVariance = 0;
  for (let i = 0; i < m; i++) {
    totalVariance += cov[i][i]; // Sum of diagonal (trace)
  }
  
  // If we can't get accurate total, use number of dimensions as fallback
  if (totalVariance <= 0 || !isFinite(totalVariance)) {
    totalVariance = m;
  }
  
  // Normalize eigenvalues by total variance
  const explainedVariance = eigenvalues.map(val => val / totalVariance);
  
  return {
    transformed,
    components,
    explainedVariance,
  };
}

