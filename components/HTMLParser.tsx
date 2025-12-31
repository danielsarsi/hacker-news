import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

interface HTMLParserProps {
  html: string;
}

function HTMLParser({ html }: HTMLParserProps) {
  return <>{parser(DOMPurify.sanitize(html))}</>;
}

export default HTMLParser;
