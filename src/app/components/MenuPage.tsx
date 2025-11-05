import MenuItemCard from "./MenuItemCard";

function MenuPage(){
return(
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* ITEM 1: Passing the props 'name', 'price', and 'description' */}
      <MenuItemCard 
        name="Caesar Salad Classic" 
        price={12.50} 
        description="Crisp romaine, Parmesan shavings, house-made croutons, and creamy dressing."
      />

      {/* ITEM 2: Using the same component with different data */}
      <MenuItemCard 
        name="Truffle Mushroom Risotto" 
        price={24.99} 
        description="Arborio rice slow-cooked in a rich cream sauce with wild mushrooms and truffle oil."
      />
      
    </div>
);
}

export default MenuPage;