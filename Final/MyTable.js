import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.tableBaseEnable = true;
        this.lastTableBaseEnabled = null;

        // Propriedades de deslocamento
        this.tableBaseDisplacement = new THREE.Vector3(0, 4, 0);
        this.tableFoot1Displacement = new THREE.Vector3(-2, 2, -5);
        this.tableFoot2Displacement = new THREE.Vector3(-2, 2, 5);
        this.tableFoot3Displacement = new THREE.Vector3(2, 2, -5);
        this.tableFoot4Displacement = new THREE.Vector3(2, 2, 5);

        // Propriedades de tamanho (mantain the proporcionality)
        this.baseWidth = 6.0;
        this.baseHeight = 1.0;
        this.baseDepth = 12.0;
        this.footRadius = 0.4;
        this.footHeight = 5.0;
    }

    /**
     * Builds the table mesh with material assigned
     */
    buildTable() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#784008",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        });

        // Geometria da base da mesa
        let box = new THREE.BoxGeometry(6.0, 12.0, 1);
        this.tableBaseMesh = new THREE.Mesh(box, boxMaterial);
        this.tableBaseMesh.rotation.x = -Math.PI / 2;
        this.tableBaseMesh.position.copy(this.tableBaseDisplacement);

        // Geometria dos pés da mesa
        let footGeometry = new THREE.CylinderGeometry(this.footRadius, this.footRadius, this.footHeight, 40);
        this.foot1Mesh = new THREE.Mesh(footGeometry, boxMaterial);
        this.foot1Mesh.position.copy(this.tableFoot1Displacement);

        this.foot2Mesh = new THREE.Mesh(footGeometry.clone(), boxMaterial);
        this.foot2Mesh.position.copy(this.tableFoot2Displacement);

        this.foot3Mesh = new THREE.Mesh(footGeometry.clone(), boxMaterial);
        this.foot3Mesh.position.copy(this.tableFoot3Displacement);

        this.foot4Mesh = new THREE.Mesh(footGeometry.clone(), boxMaterial);
        this.foot4Mesh.position.copy(this.tableFoot4Displacement);
    }

    /**
     * Rebuilds the table if required
     */
    rebuildTable() {
        if (this.tableBaseMesh) {
            this.app.scene.remove(this.tableBaseMesh);
        }
        if (this.foot1Mesh) {
            this.app.scene.remove(this.foot1Mesh);
        }
        if (this.foot2Mesh) {
            this.app.scene.remove(this.foot2Mesh);
        }
        if (this.foot3Mesh) {
            this.app.scene.remove(this.foot3Mesh);
        }
        if (this.foot4Mesh) {
            this.app.scene.remove(this.foot4Mesh);
        }

        this.buildTable();

        // Adiciona novamente os meshes à cena se a mesa estiver habilitada
        if (this.tableBaseEnable) {
            this.app.scene.add(this.tableBaseMesh);
            this.app.scene.add(this.foot1Mesh);
            this.app.scene.add(this.foot2Mesh);
            this.app.scene.add(this.foot3Mesh);
            this.app.scene.add(this.foot4Mesh);
        }

        this.lastTableBaseEnabled = null;
    }

    /**
     * Updates the table if required
     */
    updateTableIfRequired() {
        if (this.tableBaseEnable !== this.lastTableBaseEnabled) {
            this.lastTableBaseEnabled = this.tableBaseEnable;
            if (this.tableBaseEnable) {
                this.app.scene.add(this.tableBaseMesh);
                this.app.scene.add(this.foot1Mesh);
                this.app.scene.add(this.foot2Mesh);
                this.app.scene.add(this.foot3Mesh);
                this.app.scene.add(this.foot4Mesh);
            } else {
                this.app.scene.remove(this.tableBaseMesh);
                this.app.scene.remove(this.foot1Mesh);
                this.app.scene.remove(this.foot2Mesh);
                this.app.scene.remove(this.foot3Mesh);
                this.app.scene.remove(this.foot4Mesh);
            }
        }
    }

    /**
     * Updates the table position
     */
    update() {
        this.updateTableIfRequired();
        if (this.tableBaseMesh) {
            this.tableBaseMesh.position.copy(this.tableBaseDisplacement);
        }
        if (this.foot1Mesh) {
            this.foot1Mesh.position.copy(this.tableFoot1Displacement);
        }
        if (this.foot2Mesh) {
            this.foot2Mesh.position.copy(this.tableFoot2Displacement);
        }
        if (this.foot3Mesh) {
            this.foot3Mesh.position.copy(this.tableFoot3Displacement);
        }
        if (this.foot4Mesh) {
            this.foot4Mesh.position.copy(this.tableFoot4Displacement);
        }
    }
}

export { MyTable };
