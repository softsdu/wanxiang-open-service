//三次样条插值 added by ls 20231110
let CubicSpline = {	
	solve: function(xyArray) {
		let m = xyArray.length;
		for(let k = 0; k < m; k++) {
			// pivot for column
			let i_max = 0; 
			let vali = Number.MIN_SAFE_INTEGER;
			for(let i = k; i < m; i++){
				if(Math.abs(xyArray[i][k]) > vali) { 
					i_max = i; 
					vali = Math.abs(xyArray[i][k]);
				}
			}
			CubicSpline.swapRows(xyArray, k, i_max); 
			
			for(let i = k + 1; i < m; i++) {
				let cf = (xyArray[i][k] / xyArray[k][k]);
				for(let j = k; j < m + 1; j++){ 
					xyArray[i][j] -= xyArray[k][j] * cf;				
				}
			}
		}
		
		let x = [];
		
		for(let i = m - 1; i >= 0; i--) {
			let v = xyArray[i][m] / xyArray[i][i];
			x[i] = v;
			for(let j = i - 1; j >= 0; j--) {
				xyArray[j][m] -= xyArray[j][i] * v;
				xyArray[j][i] = 0;
			}
		}
		return x;
	},
	zerosMat: function(r, c) {
		let arr = [];
		for(let i = 0; i < r; i++){
			arr.push([]);
		}
		for(let i = 0; i < r; i++) {
			arr[i] = [];
			for(let j = 0; j < c; j++) {
				arr[i][j] = 0;
			}
		}
		return arr;
	},
	swapRows: function(m, k, l) {
		let p = m[k]; 
		m[k] = m[l]; 
		m[l] = p;
	},
	getNaturalKs: function(xs, ys) {
		let n = xs.length - 1;
		let xyArray = CubicSpline.zerosMat(n + 1, n + 2);			
		for(let i = 1; i < n; i++) {
			xyArray[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
			
			xyArray[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i])) ;
			
			xyArray[i][i +1 ] = 1 / (xs[i + 1] - xs[i]);
			
			xyArray[i][n + 1] = 3 * ((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1]))  +  (ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
		}
		
		xyArray[0][0] = 2 / (xs[1] - xs[0]);
		xyArray[0][1] = 1 / (xs[1] - xs[0]);
		xyArray[0][n + 1] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));
		
		xyArray[n][n - 1] = 1 / (xs[n] - xs[n - 1]);
		xyArray[n][n] = 2 / (xs[n] - xs[n - 1]);
		xyArray[n][n + 1] = 3 * (ys[n] - ys[n - 1]) / ((xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1]));
			
		return CubicSpline.solve(xyArray);		
	},
	evalSpline: function(x, xs, ys, ks) {
		let i = 1;
		while(xs[i] < x) {
			i++;
		}		
		let t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);		
		let a =  ks[i - 1]*(xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
		let b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);		
		let q = (1 - t) * ys[i - 1] + t * ys[i] + t * (1-t) * (a * (1 - t) + b * t);
		return q;
	},
	calcPoints: function(points, partCount){
		let pointCount = points.length;
		let xArray = [];
		let yArray = [];
		for(let i = 0; i < pointCount; i++){
			let point = points[i];
			xArray[i] = point.x;
			yArray[i] = point.y;
		}
		let kArray = CubicSpline.getNaturalKs(xArray, yArray);
		
		let csiPoints = [];
		for(let i = 0; i < pointCount - 1; i++){
			let fromX = xArray[i];
			let toX = xArray[i + 1];
			let partLen = (toX - fromX) / partCount;
			for(let j = 0; j < partCount; j++){
				let x = fromX + partLen * j;
				let y = CubicSpline.evalSpline(x, xArray, yArray, kArray);
				csiPoints.push({x: x, y: y});
			}			
		}
		csiPoints.push(points[pointCount - 1]);
		return csiPoints;
	},
	
	//返回n个点
	calcNPoints: function(points, n){
		let pointCount = points.length;
		let xArray = [];
		let yArray = [];
		for(let i = 0; i < pointCount; i++){
			let point = points[i];
			xArray[i] = point.x;
			yArray[i] = point.y;
		}
		let kArray = CubicSpline.getNaturalKs(xArray, yArray);

		let fromX = xArray[0];
		let toX = xArray[xArray.length - 1];
		let partWidth = (toX - fromX) / (n - 1);
		let csiPoints = [];
		for(let i = 0; i < n; i++){ 
			let x = fromX + partWidth * i;
			let y = CubicSpline.evalSpline(x, xArray, yArray, kArray);
			csiPoints.push({x: x, y: y}); 
		}
		return csiPoints;
	}
}
export default CubicSpline