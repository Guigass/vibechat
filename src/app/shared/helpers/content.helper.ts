export class ContentHelper {
    static determineContentType(body: string): string {
        if (!body) {
            return 'text';
        }

        const urlPattern = /https?:\/\/[^\s]+/g;
        const foundUrls = body.match(urlPattern);

        if (foundUrls) {
            const url = new URL(foundUrls[0]);
            const extension = url.pathname.split('.').pop()?.toLowerCase();

            switch (extension) {
                // Imagens
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'bmp':
                case 'tif':
                case 'tiff':
                case 'webp':
                case 'svg':
                    return 'image';

                // Vídeos
                case 'mp4':
                case 'webm':
                case 'avi':
                case 'mkv':
                case 'flv':
                case 'mov':
                case 'wmv':
                    return 'video';

                // Áudio
                case 'mp3':
                case 'ogg':
                case 'wav':
                case 'aac':
                case 'flac':
                case 'm4a':
                    return 'audio';

                // Documentos
                case 'pdf':
                case 'doc':
                case 'docx':
                case 'ppt':
                case 'pptx':
                case 'xls':
                case 'xlsx':
                case 'odt':
                case 'ods':
                case 'odp':
                case 'txt':
                case 'rtf':
                    return 'document';

                // Comprimidos
                case 'zip':
                case 'rar':
                case '7z':
                case 'tar':
                case 'gz':
                case 'bz2':
                case 'xz':
                    return 'compressed';

                // Executáveis
                case 'exe':
                case 'msi':
                case 'bin':
                case 'sh':
                case 'bat':
                    return 'executable';

                // Código-fonte e scripts
                case 'js':
                case 'java':
                case 'py':
                case 'cpp':
                case 'cs':
                case 'html':
                case 'css':
                case 'scss':
                case 'php':
                case 'rb':
                case 'swift':
                    return 'code';

                // E-books
                case 'epub':
                case 'mobi':
                    return 'ebook';

                // Imagens de disco
                case 'iso':
                case 'img':
                case 'dmg':
                    return 'diskimage';

                // Outros tipos de texto
                case 'json':
                case 'xml':
                case 'csv':
                    return 'text';

                // Caso não se encaixe em nenhuma das categorias anteriores
                default:
                    return 'url';
            }
        }

        return 'text';
    }
}