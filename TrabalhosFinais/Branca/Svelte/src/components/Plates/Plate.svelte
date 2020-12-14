<script>
  export let plate;
  const { name, day, type, price, img } = plate;
</script>

<div class="dish-box">
  <img class="dish-image" src="{img}" alt="{name}" />
  <div class="dish-info">
    <div>
      <div class="dish-details">
        <div class="dish-day">
          <i class="far fa-calendar-alt" />
          <p>{day}</p>
        </div>
        <div class="dish-type">
          <i class="fas fa-utensils" />
          <p>{type}</p>
        </div>
        <div class="dish-price">
          <i class="fas fa-wallet"/>
          <p>{price}€</p>
        </div>
      </div>
      <h4 class="dish-name">{name}</h4>
    </div>
  </div>
</div>
