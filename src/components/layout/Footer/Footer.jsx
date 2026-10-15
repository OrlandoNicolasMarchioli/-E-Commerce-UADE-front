import '../../ui.css';

/** Renders the site footer with configurable link columns and a copyright bar below. */
const Footer = ({ columns = [], copyright = '© 2024 E-Commerce. All rights reserved.' }) => (
  <>
    <footer className="ui-footer">
      {columns.map((col, i) => (
        <div key={i}>
          <h4>{col.heading}</h4>
          {col.links.map((link, j) => (
            <a key={j} href={link.href ?? '#'}>{link.label}</a>
          ))}
        </div>
      ))}
    </footer>
    <div className="ui-footer-bottom">{copyright}</div>
  </>
);

export default Footer;
