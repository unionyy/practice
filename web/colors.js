function setColor(color) {
    var list = document.querySelectorAll('a');
        list.forEach(e =>
        {
            e.style.color=color;
        })
}
function nightDayHandler(self) {
    var target = document.querySelector('body')
    if(self.value === 'night')
    {
        target.style.backgroundColor = 'black';
        target.style.color = 'white';
        self.value = 'day';

        setColor('red');
    }
    else{
        target.style.backgroundColor = 'white';
        target.style.color = 'black';
        self.value = 'night';

        setColor('green');

    }
}