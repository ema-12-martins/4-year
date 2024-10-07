import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
 * This class customizes the GUI interface for the app
 */
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the GUI interface
     */
    init() {
        // Adds a folder to the GUI interface for the box
        const boxFolder = this.datgui.addFolder('Box');
        // Access properties from the contents' box object
        boxFolder.add(this.contents.box, 'tableBaseMeshSize', 0, 10).name("size").onChange(() => { this.contents.box.rebuildTable(); });
        boxFolder.add(this.contents.box, 'tableBaseEnable', true).name("enabled");
        boxFolder.add(this.contents.box.tableBaseDisplacement, 'x', -5, 5).name("x displacement");
        boxFolder.add(this.contents.box.tableBaseDisplacement, 'y', -5, 5).name("y displacement");
        boxFolder.add(this.contents.box.tableBaseDisplacement, 'z', -5, 5).name("z displacement");
        boxFolder.open();

        const data = {
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // Adds a folder to the GUI interface for the plane
        const planeFolder = this.datgui.addFolder('Plane');
        planeFolder.addColor(data, 'diffuse color').onChange((value) => { this.contents.updateDiffusePlaneColor(value); });
        planeFolder.addColor(data, 'specular color').onChange((value) => { this.contents.updateSpecularPlaneColor(value); });
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange((value) => { this.contents.updatePlaneShininess(value); });
        planeFolder.open();

        // Adds a folder to the GUI interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("active camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord");
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("y coord");
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("z coord");
        cameraFolder.open();
    }
}

export { MyGuiInterface };
