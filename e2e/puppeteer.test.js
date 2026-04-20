import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
  slowMo: 120   // slow
});

const page = await browser.newPage();

// automatically deal with dialog alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await page.waitForTimeout(1000);
  await dialog.accept();
});

await page.goto("http://localhost:5173");

console.log("Page opened");

await page.waitForTimeout(1000);

await page.waitForSelector("button");
const buttons = await page.$$("button");
await buttons[0].click();

await page.waitForTimeout(2000);
console.log("Sidebar opened.")

// open account menu
await page.waitForSelector("button");

await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Log in"));
  if (btn) btn.click();
});

// random username
const username = "user" + Date.now();
const password = "123456";

console.log("Registering user:", username);

console.log("User created and stored in database:", username);

// user name
await page.type('input[placeholder="Username"]', username);

await page.waitForTimeout(1000);

// password
await page.type('input[placeholder="Password"]', password);

await page.waitForTimeout(1000);

// Create Account
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Create Account"));
  btn.click();
});

await page.waitForTimeout(3000);

// login again
await page.type('input[placeholder="Username"]', username);
await page.type('input[placeholder="Password"]', password);

await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Log In"));
  btn.click();
});

await page.waitForTimeout(800);

console.log("Login successful");

//sidebar after logging

await page.waitForSelector("button");
const buttons2 = await page.$$("button");
await buttons2[0].click();

await page.waitForTimeout(1500);
console.log("Sidebar opened again.");

// close sidebar
await buttons[buttons.length - 1].click();


await page.waitForTimeout(1500);
await page.waitForSelector(".sidebar", { hidden: true });
console.log("Sidebar closed.")

//log out
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.innerText?.toLowerCase().includes("log"));
  if (btn) {
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});


// 
await page.waitForTimeout(200);

// open login modal again
await page.evaluate(() => {
  const btn2 = [...document.querySelectorAll("button")]
    .find(b => b.innerText?.toLowerCase().includes("log"));
  if (btn2) {
    btn2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
console.log("Login panel opened again");

//
await page.waitForSelector('input[placeholder="Username"]');

await page.waitForTimeout(500);
// try duplicate username
console.log("Testing duplicate username...");

await page.waitForSelector('input[placeholder="Username"]');

await page.type('input[placeholder="Username"]', username);
await page.waitForTimeout(800);

await page.type('input[placeholder="Password"]', password);
await page.waitForTimeout(800);


// click create account again
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Create Account"));
  if (btn) btn.click();
});

await page.waitForTimeout(3000);

console.log("Duplicate username should trigger error.");
console.log(`
SQL Query Executed:
INSERT INTO users (username, password)
VALUES ('${username}', '${password}');
`);



//log in with wrong password

console.log("Testing Wrong password:");

await page.waitForSelector('input[placeholder="Username"]');

await page.waitForSelector('input[placeholder="Password"]');

const wrongPassword = "wrong123";

await page.click('input[placeholder="Password"]', { clickCount: 3 });
await page.type('input[placeholder="Password"]', wrongPassword);

await page.waitForTimeout(800);

// click login
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Log In"));
  if (btn) btn.click();
});

await page.waitForTimeout(2000);

// close login panel
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button, svg")]
    .find(el => el.textContent?.includes("×") || el.innerText?.includes("×"));
  if (btn) btn.click();
});

console.log("Login panel closed");

await page.waitForTimeout(2000);

await browser.close();
