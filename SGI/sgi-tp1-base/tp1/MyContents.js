import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null

        this.boxDisplacement = new THREE.Vector3(0,4,0)
        this.foot1Displacement = new THREE.Vector3(-2,2,-5)
        this.foot2Displacement = new THREE.Vector3(-2,2,5)
        this.foot3Displacement = new THREE.Vector3(2,2,-5)
        this.foot4Displacement = new THREE.Vector3(2,2,5)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#784008", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  6.0,  12.0,  1 );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        
        let foot1Material = new THREE.MeshPhongMaterial({ color: "#784008", 
        specular: "#000000", emissive: "#000000", shininess: 90 });

        let foot1 = new THREE.CylinderGeometry(0.4,0.4,5,40);
        this.foot1Mesh = new THREE.Mesh( foot1, foot1Material);
        this.foot1Mesh.position.x = this.foot1Displacement.x;
        this.foot1Mesh.position.y = this.foot1Displacement.y;
        this.foot1Mesh.position.z = this.foot1Displacement.z;

        
        let foot2Material = new THREE.MeshPhongMaterial({ color: "#784008", 
        specular: "#000000", emissive: "#000000", shininess: 90 });
    
        let foot2 = new THREE.CylinderGeometry(0.4,0.4,5,40);
        this.foot2Mesh = new THREE.Mesh( foot2, foot2Material);
        this.foot2Mesh.position.x = this.foot2Displacement.x;
        this.foot2Mesh.position.y = this.foot2Displacement.y;
        this.foot2Mesh.position.z = this.foot2Displacement.z;

        let foot3Material = new THREE.MeshPhongMaterial({ color: "#784008", 
        specular: "#000000", emissive: "#000000", shininess: 90 });
        
        let foot3 = new THREE.CylinderGeometry(0.4,0.4,5,40);
        this.foot3Mesh = new THREE.Mesh( foot3, foot3Material);
        this.foot3Mesh.position.x = this.foot3Displacement.x;
        this.foot3Mesh.position.y = this.foot3Displacement.y;
        this.foot3Mesh.position.z = this.foot3Displacement.z;

        let foot4Material = new THREE.MeshPhongMaterial({ color: "#784008", 
        specular: "#000000", emissive: "#000000", shininess: 90 });
            
        let foot4 = new THREE.CylinderGeometry(0.4,0.4,5,40);
        this.foot4Mesh = new THREE.Mesh( foot4, foot4Material);
        this.foot4Mesh.position.x = this.foot4Displacement.x;
        this.foot4Mesh.position.y = this.foot4Displacement.y;
        this.foot4Mesh.position.z = this.foot4Displacement.z;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 20, 20 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
            this.app.scene.remove(this.foot1Mesh)
            this.app.scene.remove(this.foot2Mesh)
            this.app.scene.remove(this.foot3Mesh)
            this.app.scene.remove(this.foot4Mesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
                this.app.scene.add(this.foot1Mesh)
                this.app.scene.add(this.foot2Mesh)
                this.app.scene.add(this.foot3Mesh)
                this.app.scene.add(this.foot4Mesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
                this.app.scene.remove(this.foot1Mesh)
                this.app.scene.remove(this.foot2Mesh)
                this.app.scene.remove(this.foot3Mesh)
                this.app.scene.remove(this.foot4Mesh)

            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };