import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.tableEnable = true;
        this.lastTableEnabled = null;

        // Propriedades de deslocamento
        this.tableDisplacement = new THREE.Vector3(0, 4, 0);

        // Propriedades de tamanho (mantendo a proporcionalidade)
        this.baseWidth = 6.0;
        this.baseHeight = 12.0;
        this.baseDepth = 1.0;
        this.footRadius = 0.4;
        this.footHeight = 7;

        // Grupo que irá conter todos os componentes da mesa
        this.tableGroup = new THREE.Group();
    }

    /**
     * Builds the table mesh with material assigned
     */
    buildTable() {
        let material = new THREE.MeshPhongMaterial({
            color: "#784008",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        });

        // Geometria da base da mesa
        let base = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
        let tableBaseMesh = new THREE.Mesh(base, material);
        tableBaseMesh.rotation.x = -Math.PI / 2;
        tableBaseMesh.position.y = 2; // Altura ajustada para centralizar a base

        // Geometria dos pés da mesa
        let footGeometry = new THREE.CylinderGeometry(this.footRadius, this.footRadius, this.footHeight, 40);

        let foot1Mesh = new THREE.Mesh(footGeometry, material);
        foot1Mesh.position.set(-2, -1, -5);  // Centraliza os pés em relação à base

        let foot2Mesh = new THREE.Mesh(footGeometry, material);
        foot2Mesh.position.set(-2, -1, 5);

        let foot3Mesh = new THREE.Mesh(footGeometry, material);
        foot3Mesh.position.set(2, -1, -5);

        let foot4Mesh = new THREE.Mesh(footGeometry, material);
        foot4Mesh.position.set(2, -1, 5);

        // Adiciona todos os componentes ao grupo da mesa
        this.tableGroup.add(tableBaseMesh);
        this.tableGroup.add(foot1Mesh);
        this.tableGroup.add(foot2Mesh);
        this.tableGroup.add(foot3Mesh);
        this.tableGroup.add(foot4Mesh);

        // Define a posição inicial do grupo
        this.tableGroup.position.copy(this.tableDisplacement);

        // Adiciona o grupo à cena
        this.app.scene.add(this.tableGroup);
    }

    /**
     * Rebuilds the table if required
     */
    rebuildTable() {
        if (this.tableGroup) {
            this.app.scene.remove(this.tableGroup);
        }

        this.tableGroup = new THREE.Group(); // Reseta o grupo
        this.buildTable();
        this.lastTableEnabled = null;
    }

    /**
     * Updates the table if required
     */
    updateTableIfRequired() {
        if (this.tableEnable !== this.lastTableEnabled) {
            this.lastTableEnabled = this.tableEnable;
            if (this.tableEnable) {
                this.app.scene.add(this.tableGroup);
            } else {
                this.app.scene.remove(this.tableGroup);
            }
        }
    }

    /**
     * Updates the table position as a whole
     */
    update() {
        this.updateTableIfRequired();
        if (this.tableGroup) {
            // Mova a mesa inteira como um único grupo
            this.tableGroup.position.copy(this.tableDisplacement);
        }
    }
}

export { MyTable };
