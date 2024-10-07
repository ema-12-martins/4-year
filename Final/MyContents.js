import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';
import { MyPlane } from './MyPlane.js'; // Importa a nova classe MyPlane

class MyContents {
    constructor(app) {
        this.app = app;
        this.axis = null;

        // Cria instâncias dos objetos grupo
        this.table = new MyTable(app);
        this.chair = new MyChair(app);
        this.plane = new MyPlane(app); // Adiciona a instância do plano

        // Inicializa o plano
        this.plane.buildPlane(); // Constrói o plano
    }

    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
        this.app.scene.add(pointLightHelper);

        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.table.buildTable(); // Construir a mesa
        this.chair.buildChair(); // Construir a cadeira
    }

    updateDiffusePlaneColor(value) {
        this.plane.updateDiffuseColor(value); // Atualiza a cor difusa do plano
    }

    updateSpecularPlaneColor(value) {
        this.plane.updateSpecularColor(value); // Atualiza a cor especular do plano
    }

    updatePlaneShininess(value) {
        this.plane.updateShininess(value); // Atualiza o brilho do plano
    }

    update() {
        this.table.update();
        this.chair.update();
    }
}

export { MyContents };
