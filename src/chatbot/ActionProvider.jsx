import { faqs } from "../../public/faqConfig";
function ActionProvider(
  createChatBotMessage,
  setStateFunc,
  createClientMessage,
  stateRef,
  createCustomMessage,
  ...rest
) {
  const greet = () => {
    const message = createChatBotMessage("Hello! I can help you with the creator process or FAQs.");
    setStateFunc(prev => ({ ...prev, messages: [...prev.messages, message] }));
  };

  const showCreatorSteps = () => {
    const message = createChatBotMessage(
      "The creator flow has 5 steps: Upload Content, Get Approved, Add Social URLs, Analytics Review, Earn & Climb."
    );
    setStateFunc(prev => ({ ...prev, messages: [...prev.messages, message] }));
  };

  const showFAQ = (question) => {
    const faq = faqs.find(f => question && f.question.toLowerCase().includes(question.toLowerCase()));
    const answer = faq ? faq.answer : "Please check the FAQ section on the website for more details.";
    const message = createChatBotMessage(answer);
    setStateFunc(prev => ({ ...prev, messages: [...prev.messages, message] }));
  };

  return {
    createChatBotMessage,
    setState: setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    greet,
    showCreatorSteps,
    showFAQ,
  };
}

export default ActionProvider;