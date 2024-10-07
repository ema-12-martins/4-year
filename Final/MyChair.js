import * as THREE from 'three';

class MyChair {
    constructor(app) {
        this.app = app;
        this.chairEnable = true;
        this.lastChairEnabled = null;

        // Propriedades de deslocamento
        this.chairBaseDisplacement = new THREE.Vector3(0, 8, 0);

        // Propriedades de tamanho (mantendo a proporcionalidade)
        this.baseWidth = 6.0;
        this.baseHeight = 1.0;
        this.baseDepth = 12.0;
    }

    /**
     * Builds the chair mesh with material assigned
     */
    buildChair() {
        let chairMaterial = new THREE.MeshPhongMaterial({
            color: "#784008",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        });

        // Geometria da base da cadeira
        let base = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
        this.chairBaseMesh = new THREE.Mesh(base, chairMaterial);
        this.chairBaseMesh.rotation.x = -Math.PI / 2;
        this.chairBaseMesh.position.copy(this.chairBaseDisplacement);
    }

    /**
     * Rebuilds the chair if required
     */
    rebuildChair() {
        if (this.chairBaseMesh) {
            this.app.scene.remove(this.chairBaseMesh);
        }

        this.buildChair();

        // Adiciona novamente o mesh à cena se a cadeira estiver habilitada
        if (this.chairEnable) {
            this.app.scene.add(this.chairBaseMesh);
        }

        this.lastChairEnabled = null;
    }

    /**
     * Updates the chair if required
     */
    updateChairIfRequired() {
        if (this.chairEnable !== this.lastChairEnabled) {
            this.lastChairEnabled = this.chairEnable;
            if (this.chairEnable) {
                this.app.scene.add(this.chairBaseMesh);
            } else {
                this.app.scene.remove(this.chairBaseMesh);
            }
        }
    }

    /**
     * Updates the chair position
     */
    update() {
        this.updateChairIfRequired();
        if (this.chairBaseMesh) {
            this.chairBaseMesh.position.copy(this.chairBaseDisplacement);
        }
    }
}

export { MyChair };
