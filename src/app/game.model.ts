/**
 * Interface que representa um jogo
 * 
 * @export
 * @interface Jogo
 * @property {number} id Identificador único do jogo
 * @property {string} titulo Título do jogo
 * @property {string} genero Gênero do jogo (ex: Ação, Aventura, RPG)
 * @property {Date} dataLancamento Data de lançamento do jogo
 * @property {string} plataforma Plataforma do jogo (ex: PC, PlayStation, Xbox)
 * @property {string} capa URL da imagem da capa do jogo
 * 
 */
export interface Jogo {
    id: string; // Identificador único do jogo
    titulo: string; // Título do jogo
    genero: string; // Gênero do jogo (ex: Ação, Aventura, RPG)
    dataLancamento: Date; // Data de lançamento do jogo
    plataforma: string; // Plataforma do jogo (ex: PC, PlayStation, Xbox)
    capa: string; // URL da imagem da capa do jogo
}