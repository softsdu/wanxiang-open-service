//hcyz 漫游
function WalkControl(){
	var that = this;
	this.engine = null;
	this.controls = null;  
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false; 
	this.prevTime = performance.now();  
	this.velocity = new THREE.Vector3();
	this.vRaycaster = new THREE.Raycaster();
	this.eyeHeight = 1.6;
	this.canLandMaxDistance = 3;

	this.initWalk = function(p) {
		that.engine = p.engine;
		that.controls = new PointerLockControls( that.engine.camera, document.body, that.engine.afterUserEscWalk ); 
		that.engine.scene.add( that.controls.getObject() );

		document.addEventListener( 'keydown', that.onKeyDown, false );
		document.addEventListener( 'keyup', that.onKeyUp, false );
	};
	
	this.lock = function(){
		that.controls.lock(); 
	}
	
	this.onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				that.moveForward = true;
				break;
			case 37: // left
			case 65: // a
				that.moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				that.moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				that.moveRight = true;
				break; 
		}
	};

	this.onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				that.moveForward = false;
				break;
			case 37: // left
			case 65: // a
				that.moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				that.moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				that.moveRight = false;
				break;
		}
	} 

	this.animateWalk = function() { 
		requestAnimationFrame( that.animateWalk );
		if ( that.controls.isLocked === true ) { 
			var time = performance.now(); 
			var delta = ( time - that.prevTime ) / 800;
			var x = (that.moveRight == that.moveLeft) ? 0 : ( that.moveRight ?  delta * 0.8 : -delta * 0.8 );
			var z = (that.moveForward == that.moveBackward) ? 0 : ( that.moveForward ?  delta : -delta );
			if(x != 0 || z != 0){
				that.controls.moveRight(x);
				that.controls.moveForward(z);
				var yMoveValue = that.getYMoveValue();
				that.controls.moveVertical(yMoveValue);
			} 
			that.prevTime = time;
		}
	}
	
	this.getYMoveValue = function(){
    	that.vRaycaster.linePrecision = 3; 
		var position = that.controls.getObject().position; 
		var direction = new THREE.Vector3(0, -1, 0);
        that.vRaycaster.set(position, direction);
        var intersects = that.vRaycaster.intersectObjects(that.engine.scene.children, true);
        var intersect = that.getCanLandIntersect(intersects);

        var testInfo = intersect == null ? "无" : intersect.object.name;
        $("#" + that.engine.options.testInfoContainerId).text(testInfo);
        
        if(intersect.distance > that.canLandMaxDistance){
        	return 0;
        }
        else{
        	return that.eyeHeight - intersect.distance;
        }        
	}
	
	this.getCanLandIntersect = function(intersects){
        if(intersects != null && intersects.length > 0){
        	for(var i = 0; i < intersects.length; i++){
        		var intersect = intersects[i];
            	var obj = intersect.object;
                if(!obj.isUserObject){
    	            var objNum = that.engine.getObjectNum(obj.name);  
    	    		var elementData =  that.engine.allModelElementHash[objNum];
    	    		var canLand = that.engine.canLandCategoryHash[elementData.categoryDBId];
    	    		if(canLand){
    	    			return intersect;
    	    		} 
                } 
        	}	
        } 
    	return null; 
	}
}