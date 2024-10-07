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
        const chairFolder = this.datgui.addFolder('Chair');

        // Controle de habilitação
        tableFolder.add(this.contents.table, 'tableEnable').name("Enabled").onChange(() => { this.contents.table.rebuildTable(); });
        chairFolder.add(this.contents.chair, 'chairEnable').name("Enabled").onChange(() => { this.contents.chair.rebuildChair(); });


        // Controle das propriedades de deslocamento dos grupos
        tableFolder.add(this.contents.table.tableDisplacement, 'x', -10, 10).name("Table X");
        tableFolder.add(this.contents.table.tableDisplacement, 'y', -10, 10).name("Table Y");
        tableFolder.add(this.contents.table.tableDisplacement, 'z', -10, 10).name("Table Z");

        chairFolder.add(this.contents.chair.chairDisplacement, 'x', -10, 10).name("Chair X");
        chairFolder.add(this.contents.chair.chairDisplacement, 'y', -10, 10).name("Chair Y");
        chairFolder.add(this.contents.chair.chairDisplacement, 'z', -10, 10).name("Chair Z");

        // Controle das propriedades dos grupos
        tableFolder.add(this.contents.table, 'baseWidth', 1.0, 20.0).name("Base Width").onChange(() => { this.contents.table.rebuildTable(); });
        tableFolder.add(this.contents.table, 'baseHeight', 0.5, 5.0).name("Base Height").onChange(() => { this.contents.table.rebuildTable(); });
        tableFolder.add(this.contents.table, 'baseDepth', 1.0, 20.0).name("Base Depth").onChange(() => { this.contents.table.rebuildTable(); });

        chairFolder.add(this.contents.chair, 'baseWidth', 1.0, 20.0).name("Base Width").onChange(() => { this.contents.chair.rebuildChair(); });
        chairFolder.add(this.contents.chair, 'baseHeight', 0.5, 5.0).name("Base Height").onChange(() => { this.contents.chair.rebuildChair(); });
        chairFolder.add(this.contents.chair, 'baseDepth', 1.0, 20.0).name("Base Depth").onChange(() => { this.contents.chair.rebuildChair(); });
        chairFolder.add(this.contents.chair, 'lateralWidth', 1.0, 20.0).name("Lateral Width").onChange(() => { this.contents.chair.rebuildChair(); });
        chairFolder.add(this.contents.chair, 'lateralHeight', 0.5, 5.0).name("Lateral Height").onChange(() => { this.contents.chair.rebuildChair(); });
        chairFolder.add(this.contents.chair, 'lateralDepth', 1.0, 20.0).name("Lateral Depth").onChange(() => { this.contents.chair.rebuildChair(); });

        tableFolder.open();
        chairFolder.open();

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
