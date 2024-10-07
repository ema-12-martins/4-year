import * as THREE from 'three';

class MyPlane {
    constructor(app) {
        this.app = app;

        // Atributos relacionados ao plano
        this.diffuseColor = "#00ffff";
        this.specularColor = "#777777";
        this.shininess = 30;

        // Material do plano
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#000000",
            shininess: this.shininess
        });

        this.planeMesh = null; // Para armazenar a malha do plano
    }

    /**
     * Constrói o plano
     */
    buildPlane() {
        const geometry = new THREE.PlaneGeometry(30, 30);
        this.planeMesh = new THREE.Mesh(geometry, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2; // Rotaciona o plano para que fique horizontal
        this.planeMesh.position.y = 0; // Define a posição vertical do plano
        this.app.scene.add(this.planeMesh); // Adiciona o plano à cena
    }

    /**
     * Atualiza a cor difusa do plano
     * @param {string} value - Nova cor difusa
     */
    updateDiffuseColor(value) {
        this.diffuseColor = value;
        this.planeMaterial.color.set(this.diffuseColor); // Atualiza a cor do material
    }

    /**
     * Atualiza a cor especular do plano
     * @param {string} value - Nova cor especular
     */
    updateSpecularColor(value) {
        this.specularColor = value;
        this.planeMaterial.specular.set(this.specularColor); // Atualiza a cor especular
    }

    /**
     * Atualiza o brilho do plano
     * @param {number} value - Novo brilho
     */
    updateShininess(value) {
        this.shininess = value;
        this.planeMaterial.shininess = this.shininess; // Atualiza o brilho
    }
}

export { MyPlane };
