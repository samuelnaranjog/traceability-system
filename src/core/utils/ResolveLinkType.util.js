// @trace SREQ-020C @

class LinkType {
    // Gate 1: Internal Document Anchors (Starts with #)
    static isInternalAnchor = (link) => link.startsWith('#');

    // Gate 2: Links to the Web (Starts with http:// or https://)
    static isWebLink = (link) => /^https?:\/\//i.test(link);

    // Gate 3: URIs to Apps (Custom protocols like obsidian://, vscode://, mailto:)
    static isAppURI = (link) => {
        return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(link) && !LinkType.isWebLink(link);
    };

    // Master Gate: Does this bypass the file system entirely?
    static bypassFileSystem = (link) => {
        return (
            LinkType.isInternalAnchor(link) || 
            LinkType.isWebLink(link) || 
            LinkType.isAppURI(link)
        );
    };
}

export default LinkType;