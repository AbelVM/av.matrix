/**
*:: av.matrix ::
*2D arrays objects & Algebra
*@author	Abel Vázquez <abel.vm@gmail.com>
*@version	1.0.6
*@since	2014-10-12
*/

(function(){

	'use strict';
	
	window.Matrix = window.Matrix || Object.create(Array); 
	Object.defineProperty(Matrix,'version',{
		value: '1.0.6',
		enumerable: true
	});
	
	// constructor
	Matrix = function matrix(e) {
		var	_args =  Array.prototype.slice.call(arguments),
				_m = Object.create(Matrix);
				_m.constructor = Matrix.prototype.constructor;
		// mount
		if (_args.every(function(a){return typeof(a)=='number'})){
			if (_args.length == 0) {
				_m = [0];
			} else {
				_m = Array.apply(null, new Array(_args[0])).map(Number.prototype.valueOf,0); 
				if (_args.length==2 && _args[1] !=1) _m = _m.map(function(a){return Array.apply(null, new Array(_args[1])).map(Number.prototype.valueOf,0)});
			}
		} else if (_args.every(function(a){return a instanceof Array})){
			if (_args.length == 1 && _args[0][0].length>0) {
				_m = _args[0];
			}else{
				if (_args.some(function(a){return _args[0].length != a.length}) ) {console.error('Matrix:constructor: Every column must have same length');return [];}
				_m = Array.apply(null, new Array(_args.length)).map(Number.prototype.valueOf,0); 
				_m = _m.map(function(a,b){return _args[b]});			
			}
			if (Matrix.isNaN(_m)) console.warn('Matrix:constructor: At least one element of the matrix is NaN');
		} else {
			console.error('Matrix:constructor: Ooops! Check your arguments');
			return [];
		}
		
		// properties
		Object.defineProperty(_m,'size',{
			get: function() { return [this.length,this[0].length || 1];},
			enumerable: true
		});
		Object.defineProperty(_m,'trace',{
			get:  function(){
				if (this.isNaN()){console.error("Matrix:trace: Matrix must be numerical"); return NaN;}
				return this.reduce(function(a,b,c){return a+b[c]},0);
			},
			enumerable: true
		});
		
		// sub-elements
		_m.item = function(i,j){
			return this[i][j] || null;
		};
		_m.row = function(i){
			return this[i] || [];
		};
		_m.column = function(j){
			var _tmp= new Array(this[0].length);
			return _tmp.map(function(a,b){return this[b][j]});
		};
		_m.minor = function(i,j){
			if (this.size().some(function(a){return a<2})) {console.error("Matrix:submatrix: vectors don't have submatrices");return Matrix();}
			var	_size = this.size,
					_final = new Matrix(_size[0]-1, _size[1]-1),
					_result = _final.map(function(a,b){return a.map(function(c,d){b=(b<i)?b:b+1;d=(d<j)?d:d+1;return _m[b][d];})});
			return Matrix(_result);
		};
		
		// process methods
		_m.fill = function(value) {
			if (isNaN(value)){console.error("Matrix:fill: Arguments must be numerical"); return Matrix()}
			value = value || 1;
			return Matrix(this.map(function(a){return a.map(function(){return value})})); 
		};
		_m.upper = function( ) {
			return Matrix(this.map(function(a,b){return a.map(function(c, d){return (b>=d)? c:0})})); 	
		};
		_m.lower = function() {
			return Matrix(this.map(function(a,b){return a.map(function(c, d){return (b<=d)? c:0})})); 	
		};
		_m.transpose = function(){	
			var	that=this,
					_size=this.size(),
					_final = new Matrix(_size[1], _size[0]);
			if (_size[0]==1 && _size[1]==1) return this;
			if (_size[0]==1) return Matrix(this[0]);
			if (_size[1]==1) {var _b=[]; _b[0]=this; return Matrix(_b);}
			return Matrix(_final.map(function(a,b){return a.map(function(c,d){return that[d][b]})}));
		};
		
		// algebra methods
		_m.scalar = function(value) {
			if (_m.isNaN()){console.error("Matrix:scalar: Matrix must be numerical"); return Matrix()}
			value = value || 1;
			return this.map(function(a){return a.map(function(b){return b*value})}); 
		};
		_m.add = function (arrB){
			if (_m.isNaN()||arrB.isNaN()){console.error("Matrix:add: Both Matrices must be numerical"); return Matrix()}
			var s = (this.samesize( arrB))? this.map(function(a,b){return a.map(function(c,d){return c+arrB[b][d]})}):[];
			if (s==[]) {console.error("Matrix:add: Dimenssions don't fit"); return Matrix()}
			return Matrix(s);
		};
		_m.dot = function(arrB){
			if (_m.isNaN()||arrB.isNaN()){console.error("Matrix:dot: Both Matrices must be numerical"); return Matrix()}
			if (_m.size()[1]!=arrB.size()[0]){console.error("Matrix:dot: Dimenssions don't fit");return Matrix();}
			var 	that = this,
					_final= new Matrix(_m.size()[0],arrB.size()[1]),
					_result = _final.map(function(a,b){return a.map(function(c,d){return that[b].reduce(function(e,f,g){return e + f * arrB[g][d]},0)})});
			return Matrix(_result);
		};
		_m.LU = function(){
			if (!this.square()||this.isNaN()){console.error("Matrix:det: Input must be an square numerical matrix"); return Matrix();}
			var	n = this.size()[0],
					_L = new Matrix.Diagonal(n),
					_U = this.clone();
			for (var k =0; k<n-1;k++){
				for (var i = k+1; i<n;i++){
					_L[i][k] = _U[i][k] / _U[k][k];
					for (var j=0; j<n; j++){
						_U[i][j] -= _U[k][j] * _L[i][k];
					}
				}
			}
			return {"L":Matrix(_L), "U":Matrix(_U)};
		};
		_m.det = function (){
			if (!this.square()||this.isNaN()){console.error("Matrix:det: Input must be an square numerical matrix"); return Matrix();}
			var	_u = this.LU().U;
			var	_final = new Matrix(_u.size()[0]);
			return _final.reduce(function(a,b,c){return a*_u[c][c]},1);
		};
		_m.adjugate = function(){
			if (!this.square()||this.isNaN()){console.error("Matrix:cofactor: Input must be an square numerical matrix"); return Matrix();}
			var	that=this,
					_size=this.size()[0],
					_final = new Matrix.Fill(_size);
			return Matrix(_final.map(function(a,b){return a.map(function(c,d){return Math.pow(-1,(b+d))*that.minor(b,d).det()})}));
		};
		_m.inverse = function(){
			if (!this.square()||this.isNaN()){console.error("Matrix:inverse: Input must be an square numerical matrix"); return Matrix();}
			var _det = this.det();
			if (_det==0){console.error("Matrix:inverse: Input matrix is not invertible"); return Matrix();}
			return this.adjugate().transpose() / this.det();
		};
		
		// checking methods 
		_m.samesize = function(arrB){
			var ad =this.size(), bd = arrB.size();
			return ad[0]==bd[0] && ad[1]==bd[1];
		};		
		_m.is = function(arrB) {
			if (this === arrB) return true;
			if ((this == null || arrB== null) || !this.samesize(arrB)) return false;
			return this.reduce(function(a,b,c){return a && b.reduce(function(e,f,g){return e && f == arrB[c][g]},true)},true);
		};
		_m.isNaN = function(){
			return Matrix.isNaN(this);
		};
		_m.symmetric = function(){
			return _m.is(_m.transpose());
		};
		_m.square = function(){
			var _size = this.size();
			return _size[0]==_size[1];
		};
		
		// xtra methods
		_m.clone = function(){
			return  new Matrix(JSON.parse(JSON.stringify(this)));
		};
		_m.tostring = function(sep){
			sep = sep || ', ';
			return (_m.size()[1]==1)?this.join(sep):_m.reduce(function(a,b){return a+b.join(sep)+'\n'},'');
		};
		// finally
		return _m;
	};
	//functions
	Matrix.Fill = function(dim, value) {
		if (isNaN(dim)||isNaN(value)){console.error("Matrix:fill: Arguments must be numerical"); return Matrix()}
		value = value || 1;
		return Matrix(Matrix(dim,dim).map(function(a){return a.map(function(){return value})})); 
	};
	Matrix.Diagonal = function(dim, value) {
		value = value || 1;
		if (isNaN(dim)||isNaN(value)){console.error("Matrix:diagonal: Arguments must be numerical"); return Matrix()}
		return new Matrix(Matrix(dim,dim).map(function(a,b){return a.map(function(c, d){return (b==d)? value:0})})); 
	};
	Matrix.Upper = function(dim, value) {
		value = value || 1;
		if (isNaN(dim)||isNaN(value)){console.error("Matrix:upper: Arguments must be numerical"); return Matrix()}
		return new Matrix(Matrix(dim,dim).map(function(a,b){return a.map(function(c, d){return (b>=d)? value:0})})); 	
	};
	Matrix.Lower = function(dim, value) {
		value = value || 1;
		if (isNaN(dim)||isNaN(value)){console.error("Matrix:lower: Arguments must be numerical"); return Matrix()}
		return new Matrix(Matrix(dim,dim).map(function(a,b){return a.map(function(c, d){return (b<=d)? value:0})})); 	
	};
	Matrix.isNaN = function(e){
		return (typeof(e[0].length)=='undefined') ? e.some(function(a){return isNaN(a)}) : e.some(function(a){return a.some(function(b){return isNaN(b)}) });
	};
	
}());