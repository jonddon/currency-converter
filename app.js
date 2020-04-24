new Vue(
    {
        el: '#app',
        data:{
            currencies:{},
            amount:'0',
            from:'EUR',
            to:'USD',
            result:0, 
            loading:false
        },
        mounted(){
            this.getCurrencies()
        },

        computed:{
            formattedCurrencies(){
                // convert object to array
              return  Object.values(this.currencies);
            },
            calculateResult(){
                return (Number(this.amount) * this.result).toFixed(2)
            }, 
            disabled(){
                return this.amount == 0 || !this.amount || this.loading
            }
        },

        methods:{
            getCurrencies(){
                //Check if there is a cached version of currencies
                const currencies = localStorage.getItem('currencies');

                if(currencies){
                    this.currencies= JSON.parse(currencies);
                    return
                }

                //End of cache check

                //Fetch currencies if there is no cached version
                axios.get('https://free.currconv.com/api/v7/currencies?apiKey=027061cb45151ff7aade')
                .then(response =>{
                    this.currencies= response.data.results;
                    //Cache currency name. Convert the object to string because only string can be stored in local storage
                    localStorage.setItem('currencies', JSON.stringify(response.data.results))
                });
            },


            convertCurrency(){
                const key = `${this.from}_${this.to}`;
                this.loading = true;
                axios.get(`https://free.currconv.com/api/v7/convert?q=${key}&apiKey=027061cb45151ff7aade`)
                .then(response =>{
                    this.loading = false;
                    this.result = response.data.results[key].val;
                    console.log(this.result);
                })
            }
        },
        watch:{
            //Watch is to watch the value of a data if it has changed and carry out a specific function if there is a change
            from(){
                this.result = 0;
            },
            to(){
                this.result = 0;
            }
        }
    }
)