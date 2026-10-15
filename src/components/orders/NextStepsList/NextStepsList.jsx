import '../../ui.css';

const NextStepsList = ({ steps = [] }) => (
  <ul className="ui-next-steps">
    {steps.map((step, i) => (
      <li key={i} className="ui-next-step">
        <span className="ui-next-step-icon">{step.icon}</span>
        <div>
          <div className="ui-next-step-title">{step.title}</div>
          <div className="ui-next-step-desc">{step.description}</div>
        </div>
      </li>
    ))}
  </ul>
);

export default NextStepsList;
