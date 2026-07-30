/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { Download, ExternalLink, Gift, PackageOpen } from "lucide-react";
import "./NotebookBonus.css";

export function NotebookBonus({ bonus }) {
  const accessLabel = bonus.accessLabel || "ACCÈS À L’OUTIL";
  const accessTitle = bonus.accessTitle || "Ouvrir NotebookLM";
  return <section className="notebook-bonus">
    <div className="notebook-bonus-label"><Gift size={15} /> BONUS DU JOUR</div>
    <div className="notebook-bonus-heading"><span><Download size={19} /></span><div><h3>{bonus.title}</h3><p>{bonus.description}</p></div></div>
    <div className="notebook-bonus-files">{bonus.downloads.map(([name, status, href]) => href ? <a href={href} download key={name}><PackageOpen size={17} /><div><b>{name}</b><small>{status} · Télécharger</small></div><Download size={16} /></a> : <div className="pending" key={name}><PackageOpen size={17} /><div><b>{name}</b><small>{status}</small></div><span>À VENIR</span></div>)}</div>
    {bonus.accessUrl && <a className="notebook-access" href={bonus.accessUrl} target="_blank" rel="noreferrer"><span><ExternalLink size={17} /></span><div><small>{accessLabel}</small><b>{accessTitle}</b></div><ExternalLink size={16} /></a>}
  </section>;
}
