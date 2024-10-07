import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';

class MyContents {
    constructor(app) {
        this.app = app;
        this.axis = null;

        // Cria uma instância de MyTable
        this.table = new MyTable(app);

        // Atributos relacionados ao plano
        this.diffusePlaneColor = "#00ffff";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 30;
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor,
            emissive: "#000000",
            shininess: this.planeShininess
        });
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

        let plane = new THREE.PlaneGeometry(20, 20);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.app.scene.add(this.planeMesh);
    }

    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value;
        this.planeMaterial.color.set(this.diffusePlaneColor);
    }

    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value;
        this.planeMaterial.specular.set(this.specularPlaneColor);
    }

    updatePlaneShininess(value) {
        this.planeShininess = value;
        this.planeMaterial.shininess = this.planeShininess;
    }

    update() {
        this.table.update(); // Atualiza a mesa
    }
}

export { MyContents };
