/**
 * Loads a Wavefront .mtl file specifying materials
 *
 * @author angelxuanchang
 */
declare function MTLLoader(manager: any): void;
declare namespace MTLLoader {
    var MaterialCreator: (baseUrl: any, options: any) => void;
}
export default MTLLoader;
