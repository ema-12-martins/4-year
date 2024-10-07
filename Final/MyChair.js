import * as THREE from 'three';

class MyChair {
    constructor(app) {
        this.app = app;
        this.chairEnable = true;
        this.lastChairEnabled = null;

        // Propriedades de deslocamento
        this.chairDisplacement = new THREE.Vector3(6, 3, 0); 

        // Propriedades de tamanho (mantendo a proporcionalidade)
        this.baseWidth = 6.0;
        this.baseHeight = 12.0; 
        this.baseDepth = 1.0; 
        this.footRadius = 0.4; 
        this.footHeight = 7;
        
        // Propriedades do lado da cadeira
        this.lateralWidth = 1.0;   // Defina a largura lateral
        this.lateralHeight = 6.0; // Defina a altura lateral
        this.lateralDepth = 12.0;   // Defina a profundidade lateral

        // Grupo que irá conter todos os componentes da cadeira
        this.chairGroup = new THREE.Group();
    }

    /**
     * Builds the chair mesh with material assigned
     */
    buildChair() {
        let material = new THREE.MeshPhongMaterial({
            color: "#784008",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        });

        // Geometria da base da cadeira
        let base = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
        let chairBaseMesh = new THREE.Mesh(base, material);
        chairBaseMesh.rotation.x = -Math.PI / 2;
        chairBaseMesh.position.y = 2;

        // Geometria dos pés da cadeira
        let footGeometry = new THREE.CylinderGeometry(this.footRadius, this.footRadius, this.footHeight, 40);

        let foot1Mesh = new THREE.Mesh(footGeometry, material);
        foot1Mesh.position.set(-2, -1, -5); 

        let foot2Mesh = new THREE.Mesh(footGeometry, material);
        foot2Mesh.position.set(-2, -1, 5);

        let foot3Mesh = new THREE.Mesh(footGeometry, material);
        foot3Mesh.position.set(2, -1, -5);

        let foot4Mesh = new THREE.Mesh(footGeometry, material);
        foot4Mesh.position.set(2, -1, 5);

        // Geometria para o lado da cadeira
        let lateral = new THREE.BoxGeometry(this.lateralWidth, this.lateralHeight, this.lateralDepth);
        
        // Cria e posiciona o lateral apenas nas costas
        let chairLateralMesh1 = new THREE.Mesh(lateral, material);
        chairLateralMesh1.position.set(this.baseWidth/2, this.baseHeight/5 + 2.1, -this.baseDepth / 2 + 0.5); // Apenas nas costas

        // Adiciona todos os componentes ao grupo da cadeira
        this.chairGroup.add(chairBaseMesh); 
        this.chairGroup.add(foot1Mesh);
        this.chairGroup.add(foot2Mesh);
        this.chairGroup.add(foot3Mesh);
        this.chairGroup.add(foot4Mesh);
        this.chairGroup.add(chairLateralMesh1); // Somente a lateral nas costas

        // Define a posição inicial do grupo
        this.chairGroup.position.copy(this.chairDisplacement); 

        // Aplica a escala ao grupo da cadeira
        this.scaleFactor = new THREE.Vector3(0.75, 0.75, 0.5);
        this.chairGroup.scale.copy(this.scaleFactor); 

        // Adiciona o grupo à cena
        this.app.scene.add(this.chairGroup);
    }

    /**
     * Rebuilds the chair if required
     */
    rebuildChair() { 
        if (this.chairGroup) {
            this.app.scene.remove(this.chairGroup); 
        }

        this.chairGroup = new THREE.Group(); 
        this.buildChair(); 
        this.lastChairEnabled = null;
    }

    /**
     * Updates the chair if required
     */
    updateChairIfRequired() { 
        if (this.chairEnable !== this.lastChairEnabled) { 
            this.lastChairEnabled = this.chairEnable; 
            if (this.chairEnable) { 
                this.app.scene.add(this.chairGroup); 
            } else {
                this.app.scene.remove(this.chairGroup); 
            }
        }
    }

    /**
     * Updates the chair position as a whole
     */
    update() {
        this.updateChairIfRequired();
        if (this.chairGroup) {
            this.chairGroup.position.copy(this.chairDisplacement);
        }
    }
}

export { MyChair };
