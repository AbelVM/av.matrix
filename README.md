av.matrix
=========

__av.matrix__ is a small & fast JavaScript matrix (2D arrays) utilities library. Pure, strict and ECMAScript 5 compliant.

It extends the core Array object to supply the basics for __linear Algebra__ (2D), in a clean, compact and __speedy__ way where the explicit loops have been avoided. But LU()... :(

Can be combined with  [av.array] (https://github.com/AbelVM/av.arrays "Small&Fast Javascript library that attaches xtra methods for arrays, including basic Descriptive Statistics functions") to get even more from your matrix!

Being __arrX__ a Matrix:

+ __Constructors:__ A matrix can be instatiated using a wide variety of inputs:
```javascript
arrA = new Matrix();					// [0]
arrB = new Matrix(n);				//	Zero row vector size = n
arrC = new Matrix(1,m);			// Zero column vector size = m
arrD = new Matrix(n,m);			// Zero matrix size = n x m

r1 = [E11,...,E1m] ;
...
rn = [En1,..., Enm];
arrE = new Matrix(r1, ..., rn);			//  nxm matrix with the given rows

arrF = new Matrix([[], ..., []]);		// Matrix from the given array of arrays (rows)	

arrG = Matrix.fill(n, value);				// Square matrix size = n, every item = value
arrH = Matrix.diagonal (n, value);	// Diagonal matrix size = n,  item(i=j) = value
arrI = Matrix.upper(n, value);			// Upper matrix size n,  item(i>=j)  = value
arrJ = Matrix.lower(n, value);			// Lower matrix size n,  item(i<=j)  = value
```

+ __Algebra methods:__ Here is where fun begins:
```javascript
arrB = arrA.scalar(value);				// New matrix, where scalar multiplication of value has been applied to arrA
arrD = arrA.add(arrC);					// New matrix that results of the sum of ArrA and ArrB, both of the same size. 
arrF = arrA.dot(arrE);					// New matrix, dot product of arrA and arrE, where size of arrA is axb and size of arrE is bxc
arrA.LU();										// Object with the matrices resulting of the LU decomposition of arrA. {"L":arrL , "U": arrU}
arrA.det();									// Returns the determinant of arrA
arrG = arrA.adjugate();					// New matrix, adjugate of arrA
arrH = arrA.inverse();					// New matrix, inverse of arrA
```

####And several support methods!

+ __Properties:__ Static methods:
```javascript
arrA.size()	;									// [n,m]
arrA.trace();									// Returns the trace of the matrix 
arrA.item(i,j);								// Returns the value of item(i,j)
arrA.row(i);									//Returns an array with the values of row i
arrA.column(j);								//Returns an array with the values of column j
```

+ __Checking methods:__ Perform some usual checks to matrices:
```javascript
arrA.samesize(arrB);						// True if both matrices have the same size
arrA.is(arrB);								// True if arrA == ArrB
arrA.isNaN();									// Trueif arrA has at least one NaN item 
arrA.symmetric();							// True if arrA is symmetric. item(i,j)==item(j,i)
arr.square();									// True if arrA is an square matrix
```

+ __Process methods:__ Methods that apply simple process to the current Matrix:
```javascript
arrB = arrA.Fill(value);						// New matrix with the same size as arrA but filled with value
arrC = arrA.Upper();							// New matrix, same as arrA, but item(i<j)  = 0
arrD = arrA.Lower();							// New matrix, same as arrA, but item(i>j)  = 0
arrE = arrA.transpose();						// New matrix, transpose of arrA. 
arrF = arrA.minor(i,j);						// New matrix, size n-1 x m-1. Minor of itemA(i,j)
```

+ __Xtra methods:__ 
```javascript
arrB = arrA.clone();							// New matrix, deep clone of arrA
arrA.tostring(sep);								// Pretty print of arrA, using sep as separator of items (default sep= ', ')
```
