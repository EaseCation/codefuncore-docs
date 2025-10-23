# Questions 答题（题库）

需求：

- 通过配置文件，读取一套题库
- 答题会话（对某次答题的一个session）
    - 玩家
    - 题目
    - 用时（倒计时）
    - 方法：提交答案
- 交互（普通SimpleForm、ModUI）（与题库框架解耦合）
- 答题结果（代码控制 `session.answer(String answer)`）
    - 正确
    - 不正确
    - 超时

```yaml
questions:
	- question: "题目"
		answer: "xxxxx"
		other:
			- "xxxxxxxx"
			- "yyyyyyyy"
			- "zzzzzzzz"
```

```java
Questions.register("ny2022", config);
QuestionBank bank = Questions.getBank("ny2022");
Question question = bank.getQuestionRandom();
QuestionSession session = question.createSession();
ModUI.openStackUI(new QuestionModUI(player, session));
// 在交互实现中：
session.getQuestion();
session.getRandomAnswers();
session.getTimeLeft();
QuestionAnswerResult result = session.answer(String answer);
```
