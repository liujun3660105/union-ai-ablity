
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atomDark as dark} from 'react-syntax-highlighter/dist/cjs/styles/prism'

type MarkdownComponent = Parameters<typeof ReactMarkdown>['0']['components'];

const basicComponents : MarkdownComponent = {
    code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      },
}
export default basicComponents