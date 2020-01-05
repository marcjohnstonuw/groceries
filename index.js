const fs = require('fs');
const express = require('express');

const recipes = JSON.parse(fs.readFileSync('./recipes.json'));
const ingredients = JSON.parse(fs.readFileSync('./ingredients.json'));
const recipeNames = Object.keys(recipes);

const getGroceryItems = (category) => Object.entries(category)
    .map(([ingredient, amount]) => `<p>${ingredient} - ${amount}</p>`)
    .join('\n');

const getGroceryList = (recipesToGet) => {
    console.log(recipesToGet);

    const output = {};

    Object.entries(recipes).filter(([name, recipe]) => recipesToGet.indexOf(name) !== -1)
        .forEach(([name, recipe]) => {
            // console.log(name);
            // console.log(Object.keys(recipe));
            Object.entries(recipe.ingredients).forEach(([ingredient, amount]) => {
                const category = ingredients[ingredient];
                if (!output[category]) {
                    output[category] = {};
                }
                if (!output[category][ingredient]) {
                    output[category][ingredient] = amount;
                } else {
                    output[category][ingredient] = output[category][ingredient] + `, ${amount}`;
                }
            })
        });

    return `<h1>Groceries</h1>` +
        Object.entries(output)
            .map(([category, items]) => `<h2>${category}</h2>` +
                getGroceryItems(items)
            ).join(`\n`);
};

// console.log(JSON.stringify(output));

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <html>
        <body>
            <h1>What are we eating?</h1>
            <form action="/list" method="GET">
            ${recipeNames.map(name => `<label>
                <input type="checkbox" name="food" value="${name}" />
                ${name}
            </label>`).join('<br />')}
            <br />
            <button type="submit">Get the list!</button>
            </form>
        </body>
    </html>
    `);
});

app.get('/list', (req, res) => {
    res.send(getGroceryList(req.query.food));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))