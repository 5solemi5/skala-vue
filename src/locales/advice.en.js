/**
 * Verdict copy (English)
 *
 * Not a literal translation. Each line has to sound like the person who
 * actually does that work — a body shop says "blushing", a farm says
 * "row cover", a site says "work at height" — so the trade words came first
 * and the sentence was written around them.
 *
 * {temp} and {minTemp} already carry their unit symbol.
 */
export default {
  // ── auto repair shop ────────────────────────
  'advice.repair.paintStop.title': 'Hold off on paintwork',
  'advice.repair.paintStop.desc':
    '{humidity}% humidity — moisture gets trapped in the film and it blushes',
  'advice.repair.paintSlow.title': 'Allow extra cure time',
  'advice.repair.paintSlow.desc': '{humidity}% humidity — curing runs slower than usual',
  'advice.repair.paintGood.title': 'Good day for paintwork',
  'advice.repair.paintGood.desc': '{humidity}% humidity — drying conditions are steady',
  'advice.repair.aircon.title': 'Expect a rush on A/C recharges',
  'advice.repair.aircon.desc': '{temp} this afternoon — check your refrigerant stock',
  'advice.repair.battery.title': 'More flat-battery callouts today',
  'advice.repair.battery.desc': 'Low of {minTemp} — check batteries and antifreeze',
  'advice.repair.crash.title': 'More collision work coming in',
  'advice.repair.crash.desc': '{cond} forecast — leave slack in the bodywork schedule',

  // ── farming ─────────────────────────────────
  'advice.farm.sprayStop.title': "Don't spray today",
  'advice.farm.sprayStop.desc':
    '{humidity}% humidity · {rainProb}% chance of rain — it will wash straight off',
  'advice.farm.mold.title': 'Easy day for fungal disease to spread',
  'advice.farm.mold.desc': '{humidity}% humidity — leaves stay wet for hours',
  'advice.farm.frost.title': 'Frost is possible tonight',
  'advice.farm.frost.desc': 'Low of {minTemp} — cover the crop tonight or harvest early',
  'advice.farm.heat.title': 'Stay out of the midday field',
  'advice.farm.heat.desc': '{temp} this afternoon — noon to 4pm is the heat-illness window',
  'advice.farm.water.title': 'A day for watering',
  'advice.farm.water.desc':
    '{rainProb}% chance of rain · {humidity}% humidity — no rain due for a while',

  // ── cycling ─────────────────────────────────
  'advice.bike.rainStop.title': 'Leave the bike at home',
  'advice.bike.rainStop.desc':
    '{rainProb}% chance of rain — wet tarmac stretches your braking distance a long way',
  'advice.bike.rainWarn.title': 'You may get caught in rain',
  'advice.bike.rainWarn.desc':
    '{rainProb}% chance of rain — take a shell and skip the ambitious route',
  'advice.bike.windStop.title': 'The wind is too strong',
  'advice.bike.windStop.desc': '{wind}m/s — a crosswind that will take your line',
  'advice.bike.windWarn.title': 'Strong headwind',
  'advice.bike.windWarn.desc': "{wind}m/s — it'll take more out of you than usual",
  'advice.bike.heat.title': 'Avoid the middle of the day',
  'advice.bike.heat.desc': '{temp} — drink often and ride early or after sundown',
  'advice.bike.gloves.title': 'Take gloves',
  'advice.bike.gloves.desc': 'Low of {minTemp} — your hands go first',
  'advice.bike.good.title': 'A good day to ride',
  'advice.bike.good.desc': '{temp} · light wind — you can stay out a long while',

  // ── baseball ────────────────────────────────
  'advice.baseball.precipStop.title': 'The game may be called off',
  'advice.baseball.precipStop.desc': '{cond} — check the club notice before you leave',
  'advice.baseball.rainHigh.title': 'A rainout looks likely',
  'advice.baseball.rainHigh.desc':
    '{rainProb}% chance of rain — decide about your ticket in advance',
  'advice.baseball.rainMid.title': 'Rain could arrive mid-game',
  'advice.baseball.rainMid.desc':
    '{rainProb}% chance of rain — bring a poncho (most parks limit umbrellas)',
  'advice.baseball.hot.title': 'The stands will be hot',
  'advice.baseball.hot.desc': '{temp} — bring a cap and water, and pick a shaded seat',
  'advice.baseball.night.title': 'It cools off after sunset',
  'advice.baseball.night.desc': 'Low of {minTemp} — take a layer for a night game',
  'advice.baseball.wind.title': 'Strong wind at the park',
  'advice.baseball.wind.desc': '{wind}m/s — a hard day to read a fly ball',
  'advice.baseball.good.title': 'A good day at the ballpark',
  'advice.baseball.good.desc': '{temp} · {rainProb}% chance of rain — comfortable for nine innings',

  // ── site work ───────────────────────────────
  'advice.site.heatStop.title': 'Reschedule outdoor work',
  'advice.site.heatStop.desc': '{temp} — heatwave range. Build in an hourly break',
  'advice.site.heatWarn.title': 'Watch the heat',
  'advice.site.heatWarn.desc': '{temp} — set up shade and drinking water first',
  'advice.site.windStop.title': 'Stop work at height',
  'advice.site.windStop.desc': '{wind}m/s — unsafe for crane and scaffold work',
  'advice.site.windWarn.title': 'Loose material could blow',
  'advice.site.windWarn.desc': '{wind}m/s — re-secure stacked loads and temporary structures',
  'advice.site.precipStop.title': 'Restrict work in the rain',
  'advice.site.precipStop.desc': 'Shock and fall risk both climb',
  'advice.site.rainWarn.title': 'Rain possible this afternoon',
  'advice.site.rainWarn.desc':
    '{rainProb}% chance of rain — check footing on platforms and cover materials',
  'advice.site.freeze.title': 'The ground may freeze',
  'advice.site.freeze.desc': 'Low of {minTemp} — watch early travel and concrete curing',

  // ── hiking ──────────────────────────────────
  'advice.hike.rainStop.title': 'Put the hike off',
  'advice.hike.rainStop.desc':
    '{rainProb}% chance of rain — wet rock and leaf litter are where people slip',
  'advice.hike.rainWarn.title': 'You may get caught in rain',
  'advice.hike.rainWarn.desc':
    '{rainProb}% chance of rain — take a waterproof shell and keep the route short',
  'advice.hike.ridgeWind.title': 'Dangerous wind on the ridge',
  'advice.hike.ridgeWind.desc': '{wind}m/s down here — it is stronger up top',
  'advice.hike.summitCold.title': 'The summit could be below freezing',
  'advice.hike.summitCold.desc': 'Low of {minTemp} — it drops further with every 100m you climb',
  'advice.hike.heat.title': 'Start early',
  'advice.hike.heat.desc': '{temp} — carry more water than usual for the middle of the day',
  'advice.hike.good.title': 'A good day on the mountain',
  'advice.hike.good.desc': '{temp} · {rainProb}% chance of rain — easy walking conditions',

  // ── laundry & airing ────────────────────────
  'advice.laundry.rainStop.title': "Don't hang it outside",
  'advice.laundry.rainStop.desc':
    '{rainProb}% chance of rain — you may be out there taking it back in',
  'advice.laundry.humidStop.title': "It won't dry today",
  'advice.laundry.humidStop.desc':
    '{humidity}% humidity — it stays damp and picks up a smell',
  'advice.laundry.humidWarn.title': 'Drying will take a while',
  'advice.laundry.humidWarn.desc': '{humidity}% humidity — leave the heavy things for another day',
  'advice.laundry.windy.title': 'Clip everything down',
  'advice.laundry.windy.desc': '{wind}m/s — light garments will take off',
  'advice.laundry.coldAir.title': 'Air the place out in short bursts',
  'advice.laundry.coldAir.desc': '{temp} — five minutes at a time, a few times over',
  'advice.laundry.airGood.title': 'Good day to air the place out',
  'advice.laundry.airGood.desc':
    '{humidity}% humidity · {rainProb}% chance of rain — leave the windows open',
  'advice.laundry.bedding.title': 'Even the bedding will dry',
  'advice.laundry.bedding.desc': '{humidity}% humidity · {wind}m/s — all of it, by this evening',
  'advice.laundry.freeze.title': 'It could freeze overnight',
  'advice.laundry.freeze.desc': 'Low of {minTemp} — bring it in before sundown',

  // ── nothing matched ─────────────────────────
  'advice.common.nothing.title': 'Nothing to watch for today',
  'advice.common.nothing.desc': 'An ordinary day — carry on as usual',
}
