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
        // Adiciona uma pasta para a mesa
        const tableFolder = this.datgui.addFolder('Table');

        // Controle de habilitação da mesa
        tableFolder.add(this.contents.table, 'tableBaseEnable').name("Enabled").onChange(() => { this.contents.table.rebuildTable(); });

        // Controle das propriedades de deslocamento da base da mesa
        tableFolder.add(this.contents.table.tableBaseDisplacement, 'x', -10, 10).name("Base X");
        tableFolder.add(this.contents.table.tableBaseDisplacement, 'y', -10, 10).name("Base Y");
        tableFolder.add(this.contents.table.tableBaseDisplacement, 'z', -10, 10).name("Base Z");

        // Controle das propriedades de tamanho da mesa
        tableFolder.add(this.contents.table, 'baseWidth', 1.0, 20.0).name("Base Width").onChange(() => { this.contents.table.rebuildTable(); });
        tableFolder.add(this.contents.table, 'baseHeight', 0.5, 5.0).name("Base Height").onChange(() => { this.contents.table.rebuildTable(); });
        tableFolder.add(this.contents.table, 'baseDepth', 1.0, 20.0).name("Base Depth").onChange(() => { this.contents.table.rebuildTable(); });

        // Controle das propriedades de deslocamento dos pés da mesa
        tableFolder.add(this.contents.table.tableFoot1Displacement, 'x', -10, 10).name("Foot1 X");
        tableFolder.add(this.contents.table.tableFoot1Displacement, 'y', -10, 10).name("Foot1 Y");
        tableFolder.add(this.contents.table.tableFoot1Displacement, 'z', -10, 10).name("Foot1 Z");

        tableFolder.add(this.contents.table.tableFoot2Displacement, 'x', -10, 10).name("Foot2 X");
        tableFolder.add(this.contents.table.tableFoot2Displacement, 'y', -10, 10).name("Foot2 Y");
        tableFolder.add(this.contents.table.tableFoot2Displacement, 'z', -10, 10).name("Foot2 Z");

        tableFolder.add(this.contents.table.tableFoot3Displacement, 'x', -10, 10).name("Foot3 X");
        tableFolder.add(this.contents.table.tableFoot3Displacement, 'y', -10, 10).name("Foot3 Y");
        tableFolder.add(this.contents.table.tableFoot3Displacement, 'z', -10, 10).name("Foot3 Z");

        tableFolder.add(this.contents.table.tableFoot4Displacement, 'x', -10, 10).name("Foot4 X");
        tableFolder.add(this.contents.table.tableFoot4Displacement, 'y', -10, 10).name("Foot4 Y");
        tableFolder.add(this.contents.table.tableFoot4Displacement, 'z', -10, 10).name("Foot4 Z");

        tableFolder.open();

        const data = {
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // Adiciona uma pasta para o plano
        const planeFolder = this.datgui.addFolder('Plane');
        planeFolder.addColor(data, 'diffuse color').onChange((value) => { this.contents.updateDiffusePlaneColor(value); });
        planeFolder.addColor(data, 'specular color').onChange((value) => { this.contents.updateSpecularPlaneColor(value); });
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("Shininess").onChange((value) => { this.contents.updatePlaneShininess(value); });
        planeFolder.open();

        // Adiciona uma pasta para a câmera
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("Active Camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("Camera X");
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("Camera Y");
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("Camera Z");
        cameraFolder.open();
    }
}

export { MyGuiInterface };
