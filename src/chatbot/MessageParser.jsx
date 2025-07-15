import { faqs } from "../../public/faqConfig";

function MessageParser(actionProvider, state) {
  return {
    parse(message) {
      const lower = message.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi")) {
        actionProvider.greet();
      } else if (lower.includes("step") || lower.includes("creator flow")) {
        actionProvider.showCreatorSteps();
      } else {
        const matchedFaq = faqs.find(f => lower.includes(f.question.toLowerCase().split(" ")[0]));
        if (matchedFaq) {
          actionProvider.showFAQ(matchedFaq.question);
        } else {
          actionProvider.showFAQ();
        }
      }
    }
  };
}


export default MessageParser;
