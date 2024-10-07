import * as THREE from 'three';

class MyCake {
    constructor(app) {
        this.app = app;
        this.cakeEnable = true;
        this.lastCakeEnabled = null;

        // Propriedades de deslocamento
        this.cakeDisplacement = new THREE.Vector3(0, 7.5, 0);

        // Parâmetros do cilindro
        this.radiusTop = 5;        // Raio no topo
        this.radiusBottom = 5;     // Raio na base
        this.height = 10;          // Altura do cilindro
        this.radialSegments = 32;  // Segmentos radiais
        this.heightSegments = 1;   // Segmentos na altura
        this.openEnded = false;    // Se o cilindro tem tampas
        this.thetaStart = 0;       // Ângulo inicial do cilindro (0 é o padrão)
        this.thetaLength = Math.PI * 1.7; // Ângulo de abertura do cilindro (1.5 PI para deixar 1/4 removido)

        // Inicializa a malha (cakeMesh)
        this.cakeMesh = null;
    }

    buildCake() {
        // Verifica se a malha já existe, para não criar múltiplos
        if (this.cakeMesh !== null) {
            this.app.scene.remove(this.cakeMesh);
        }

        // Cria a geometria com a fatia removida
        const cylinderGeometry = new THREE.CylinderGeometry(
            this.radiusTop, 
            this.radiusBottom, 
            this.height, 
            this.radialSegments, 
            this.heightSegments, 
            this.openEnded, 
            this.thetaStart, 
            this.thetaLength
        );

        // Material básico para visualizar o cilindro
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,  // Cor branca sólida
            side: THREE.DoubleSide,  // Renderiza faces internas e externas
        });
        

        // Cria o Mesh (bolo)
        this.cakeMesh = new THREE.Mesh(cylinderGeometry, material);

        // Posiciona o bolo na cena com base no deslocamento definido
        this.cakeMesh.position.copy(this.cakeDisplacement);

        //Meter mais pequeno
        this.scaleFactor = new THREE.Vector3(0.4, 0.2, 0.4);
        this.cakeMesh.scale.copy(this.scaleFactor); 

        // Adiciona o bolo à cena
        this.app.scene.add(this.cakeMesh);
    }

    rebuildCake() {
        // Verifica se o bolo está habilitado para ser reconstruído
        if (this.cakeEnable && this.lastCakeEnabled !== this.cakeEnable) {
            // Remove a malha anterior, se existir
            if (this.cakeMesh) {
                this.app.scene.remove(this.cakeMesh);
            }

            // Cria um novo bolo (com a fatia removida)
            this.buildCake();

            // Atualiza o status para não reconstruir desnecessariamente
            this.lastCakeEnabled = this.cakeEnable;
        }
    }

    updateCakeIfRequired() { 
        if (this.cakeEnable !== this.lastCakeEnabled) { 
            this.lastCakeEnabled = this.cakeEnable; 
            if (this.cakeEnable) { 
                this.app.scene.add(this.cakeMesh);  // Adiciona o bolo à cena
            } else { 
                this.app.scene.remove(this.cakeMesh);  // Remove o bolo da cena
            }
        }
    }    

    update() {
        if (this.cakeEnable !== this.lastCakeEnabled) {
            this.rebuildCake();
        }
    }
}

export { MyCake };
