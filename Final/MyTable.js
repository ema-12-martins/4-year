import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.tableBaseMeshSize = 1.0;
        this.tableBaseEnable = true;
        this.lastTableBaseEnabled = null;
        this.tableBaseDisplacement = new THREE.Vector3(0, 4, 0);
    }

    /**
     * Builds the box mesh with material assigned
     */
    buildTable() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#784008",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        });

        let box = new THREE.BoxGeometry(6.0, 12.0, 1.0);
        this.tableBaseMesh = new THREE.Mesh(box, boxMaterial);
        this.tableBaseMesh.rotation.x = -Math.PI / 2;
        this.tableBaseMesh.position.y = this.tableBaseDisplacement.y;
    }

    /**
     * Rebuilds the box mesh if required
     */
    rebuildTable() {
        if (this.tableBaseMesh !== undefined && this.tableBaseMesh !== null) {
            this.app.scene.remove(this.tableBaseMesh);
        }
        this.buildTable();
        this.lastTableBaseEnabled = null;
    }

    /**
     * Updates the box mesh if required
     */
    updateTableIfRequired() {
        if (this.tableBaseEnable !== this.lastTableBaseEnabled) {
            this.lastTableBaseEnabled = this.tableBaseEnable;
            if (this.tableBaseEnable) {
                this.app.scene.add(this.tableBaseMesh);
            } else {
                this.app.scene.remove(this.tableBaseMesh);
            }
        }
    }

    /**
     * Updates the box position
     */
    update() {
        this.updateTableIfRequired();
        if (this.tableBaseMesh) {
            this.tableBaseMesh.position.x = this.tableBaseDisplacement.x;
            this.tableBaseMesh.position.y = this.tableBaseDisplacement.y;
            this.tableBaseMesh.position.z = this.tableBaseDisplacement.z;
        }
    }
}

export { MyTable };
